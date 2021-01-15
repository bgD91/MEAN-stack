import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Form} from '@angular/forms';

import {Post} from './post.model';
import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();


  constructor(private http: HttpClient, private router: Router) {
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(page: number, pageSize: number) {
    const queryParams = `?page=${page}&pageSize=${pageSize}`;

    this.http.get<{
      message: string,
      posts: Post[],
      maxPosts: number
    }>(BACKEND_URL + queryParams)
      .pipe(
        map((postData: { message: string; posts: Post[], maxPosts: number }) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostData.maxPosts});
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>
    (BACKEND_URL + `/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    return this.http.put<{ post: Post }>(BACKEND_URL + `/${id}`, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + `/${id}`);
  }
}
