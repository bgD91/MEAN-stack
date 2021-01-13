import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Form} from '@angular/forms';


@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  private postUrl = 'http://localhost:3000/api/posts';


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
    }>(this.postUrl + queryParams)
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
        console.log(transformedPostData);
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
    (`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{
      message: string,
      post: Post
    }>(
      'http://localhost:3000/api/posts',
      postData
    )
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
    return this.http.put<{
      post: Post
    }>(`http://localhost:3000/api/posts/${id}`,
      postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(`http://localhost:3000/api/posts/${id}`);
  }
}
