import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  templateUrl: './post-create.component.html',
  selector: 'app-post-create',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  private mode = 'create';
  postId: string;
  post: Post;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.valid) {
      const post: Post = {
        id: null,
        title: form.value.title,
        content: form.value.content,
      };
      if (this.mode === 'create') {
        this.postService.addPost(form.value.title, form.value.content);
        // this.postService.addPost(post.title, post.content);
      } else {
        this.postService.updatePost(
          this.postId,
          form.value.title,
          form.value.content
        );
        form.resetForm();
      }
      form.resetForm();
    }
  }
}
