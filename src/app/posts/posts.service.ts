import { Post } from './post.model';
import { Subject } from 'rxjs';
export class PostService {
  private postsUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  getPosts() {
    return [...this.posts];
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    const newPost: Post = post;
    this.posts.push(newPost);
    this.postsUpdated.next([...this.posts])
  }
}