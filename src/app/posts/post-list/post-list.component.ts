import { Component, OnDestroy, OnInit } from '@angular/core';
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
  userId: string;
  totalPosts = 0;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 2, 4, 10];
  constructor(
    public postService: PostService,
    private authService: AuthService
  ) {}
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((postsData: { posts: Post[]; postCount: number }) => {
        this.userId = this.authService.getUserId();
        this.posts = [...postsData.posts].splice(
          this.postsPerPage * (this.currentPage - 1),
          this.postsPerPage
        );
        this.totalPosts = postsData.posts.length;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  // onChangedPage(pageData: PageEvent) {
  //   this.currentPage = pageData.pageIndex + 1;
  //   this.postsPerPage = pageData.pageSize;
  //   this.postService.getPosts();
  // }

  onArrowClicked(clickEvent: any) {
      if (
        clickEvent.target.classList.contains('arrow-right') &&
        this.currentPage< Math.ceil(this.totalPosts / 3)
      ) {
        this.currentPage = this.currentPage + 1;
      } else if (clickEvent.target.classList.contains('arrow-left') && this.currentPage - 1 > 0) {
        this.currentPage = this.currentPage - 1;
      }
    this.postService.getPosts();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts();
    });
  }
}
