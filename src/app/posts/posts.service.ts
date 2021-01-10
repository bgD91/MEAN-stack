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
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http.get<{
      message: string,
      posts: Post[]
    }>('http://localhost:3456/api/posts')
      .pipe(map((postData: { message: string; posts: Post[] }) => {
        return postData.posts.map((post: any) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          };
        });
      }))
      .subscribe((modifiedPosts) => {
        this.posts = modifiedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
    }>
    (`http://localhost:3456/api/posts/${id}`);
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
      'http://localhost:3456/api/posts',
      postData
    )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
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
        imagePath: image
      };
    }
    return this.http.put<{
      post: Post
    }>(`http://localhost:3456/api/posts/${id}`,
      postData)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next(this.posts);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete<{
      message: string
    }>(`http://localhost:3456/api/posts/${id}`)
      .subscribe((response) => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
