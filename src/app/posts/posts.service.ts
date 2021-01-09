import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';


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
    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3456/api/posts')
      .pipe(map((postData: { message: string; posts: Post[] }) => {
        return postData.posts.map((post: any) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
          };
        });
      }))
      .subscribe((modifiedPosts) => {
        this.posts = modifiedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    return this.http.get<{ post: { _id: string, title: string, content: string } }>(`http://localhost:3456/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3456/api/posts', post)
      .subscribe(responseData => {
        post.id = responseData.postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  editPost(id: string, title: string, content: string) {
    const post: Post = {id, title, content};
    return this.http.put<{ message: string }>(`http://localhost:3456/api/posts/${id}`, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next(this.posts);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http.delete<{ message: string }>(`http://localhost:3456/api/posts/${id}`)
      .subscribe((response) => {
        const updatedPosts = this.posts.filter(post => post.id !== id);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
