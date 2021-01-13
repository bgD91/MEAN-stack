import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {Post} from '../post.model';
import {PostsService} from '../posts.service';
import {PageEvent} from '@angular/material';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private $posts: Subscription;
  private $authListener: Subscription;
  userIsAuthenticated = false;
  userId: string;

  isLoading = false;

  totalPostsLength = 0;
  currentPage = 1;
  postsPerPage = 6;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;

    this.userId = this.authService.getUserId();

    this.postsService.getPosts(this.currentPage, this.postsPerPage);
    this.$posts = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPostsLength = postData.postCount;
        this.userId = this.authService.getUserId();
      });

    this.userIsAuthenticated = this.authService.getIsAuth();

    this.$authListener = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.currentPage, this.postsPerPage);
  }

  deletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(
      () => {
      this.isLoading = false;
      this.postsService.getPosts(this.currentPage, this.postsPerPage);
    }, error => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.$posts.unsubscribe();
    this.$authListener.unsubscribe();
  }
}
