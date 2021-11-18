import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class PostService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts').subscribe((postData) => {
      this.posts = postData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const newPost: Post = post;
    this.http.post('http://localhost:3000/api/posts', newPost).subscribe((responseData) => {
      console.log(responseData);
      this.posts.push(newPost);
      this.postsUpdated.next([...this.posts]);
    })
  }
}