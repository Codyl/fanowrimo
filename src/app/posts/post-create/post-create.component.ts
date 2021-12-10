import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import * as d3 from 'd3';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId: string;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    //The Reactive form control data
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      goal: new FormControl(50000, { validators: [Validators.required] }),
      wordCount: new FormControl(0, { validators: [Validators.required] }),
    });
    //Watch changes in params from route
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      //If route in url is ~edit/:postId we are editing and fetch using postService getPost function
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            description: postData.description,
            imagePath: postData.imagePath,
            creator: postData.creator,
            goal: postData.goal,
            wordCount: postData.wordCount,
          };
          this.form.setValue({
            title: this.post.title,
            description: this.post.description,
            image: this.post.imagePath,
            goal: this.post.goal,
            wordCount:
              this.post.wordCount[this.post.wordCount.length - 1].count,
          });



          //Now we draw the d3 chart
          const margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 1060 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
          
          // Make the svg
          const svg = d3
            .select('div#line')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr(
              'transform',
              'translate(' + margin.left + ',' + margin.top + ')'
          );
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(postData.wordCount.map(d => Date.parse(d.date) )
              )
            )
            .range([0, width]);
          svg
            .append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x));
          // console.log(x)
          const y = d3
            .scaleLinear()
            .domain([
              0,
              postData.goal,
            ])
            .range([height, 0]);
          svg.append('g').call(d3.axisLeft(y));

          svg
            .append('path')
            .datum(postData.wordCount)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr(
              'd',
              d3
                .line()
                .x(function (d) {
                  // console.log(d)
                  return x(Date.parse(d.date));
                })
                .y(function (d) {
                  return y(d.count);
                })
          );

        }
        );
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.goal,
        this.form.value.wordCount
      );
    } else {
      console.log(this.form.value.wordCount);
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.description,
        this.form.value.image,
        this.form.value.goal,
        this.form.value.wordCount
      );
    }
    this.form.reset();
  }
}
