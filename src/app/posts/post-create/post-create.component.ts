import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  private componentState = 'create';
  private postId: string;
  public post: Post;

  constructor(public postsService: PostsService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.componentState = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.post = {id: postData.post._id, title: postData.post.title, content: postData.post.content};
        });
      } else {
        this.componentState = 'create';
        this.postId = null;
      }
    });
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(this.route);
    if (this.componentState === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.editPost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }
}
