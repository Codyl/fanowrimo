import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts'
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts
              .filter((post) => post.creator === this.authService.getUserId())
              .map((post) => {
                // console.log(post.wordCount, "get word count")
                return {
                  title: post.title,
                  description: post.description,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator,
                  goal: +post.goal,
                  wordCount: post.wordCount,
                  yearWritten: post.yearWritten,
                };
              }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        // console.log(transformedPostsData);
        this.posts = transformedPostsData.posts;
        // console.log(this.posts, " <- posts updated")
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      description: string;
      imagePath: string;
      creator: string;
      goal: number;
      wordCount: [{ count: number; date: string }];
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(
    title: string,
    description: string,
    image: File,
    goal: number,
    wordCount: number
  ) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('description', description);
    if(image)
    postData.append('image', image, title);
    postData.append('goal', `${goal}`);
    postData.append('wordCount', `${wordCount}`);
    postData.append('yearWritten', new Date().getFullYear().toString());
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts/',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/books']);
      });
  }

  updatePost(
    id: string,
    title: string,
    description: string,
    image: File | string,
    goal: number,
    wordCount: number
  ) {
    let postData: Post | FormData;
    let oldWordCountArr: [{ count: number; date: string }];
    this.getPost(id).subscribe((postDataForCount) => {
      oldWordCountArr = postDataForCount.wordCount;
      //If written on same day change the last write to have the new count
      let newWordCount;
      if (
        oldWordCountArr[oldWordCountArr.length - 1].date ==
        new Date().toDateString()
      ) {
        oldWordCountArr[oldWordCountArr.length - 1] = {
          count: wordCount,
          date: oldWordCountArr[oldWordCountArr.length - 1].date,
        };
        newWordCount = [...oldWordCountArr];
      } else {
        newWordCount = [
          ...oldWordCountArr,
          { count: wordCount, date: new Date().toDateString() },
        ];
      }
      if (typeof image === 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('description', description);
        postData.append('image', image, title);
        postData.append('goal', `${goal}`);
        postData.append('wordCount', `${wordCount}`);
      } else {
        postData = {
          id: id,
          title: title,
          description: description,
          imagePath: image,
          creator: null,
          goal: goal,
          wordCount: newWordCount,
        };
      }
      this.http
        .put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe((response) => {
          this.router.navigate(['/books']);
        });
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
