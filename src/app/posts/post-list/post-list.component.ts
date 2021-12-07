import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  totalPosts = 0;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 4, 10];
  // posts = [
  //   { title: 'tst', content: 'The content' },
  //   { title: 'tst 2', content: 'The content' },
  //   { title: 'tst 3', content: 'The content' },
  // ];
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((postsData: {posts: Post[], postCount: number}) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    })
  }
}
