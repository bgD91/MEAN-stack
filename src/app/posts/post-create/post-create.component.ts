import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {PostsService} from '../posts.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Post} from '../post.model';
import {mimeType} from './mime-type.validator';

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
  post: Post;

  isLoading = false;

  form: FormGroup;

  imagePreview: string | ArrayBuffer;

  constructor(public postsService: PostsService, private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(
        null,
        {
          validators:
            [
              Validators.required,
              Validators.minLength(3)
            ]
        }
      ),
      content: new FormControl(
        null, {
          validators:
            [
              Validators.required
            ]
        }),
      image: new FormControl(
        null,
        {
          validators:
            [
              Validators.required
            ],
          asyncValidators:
            [
              mimeType
            ]
        }
      )
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.componentState = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.componentState = 'create';
        this.postId = null;
      }
    });
  }

  onFormSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.componentState === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.editPost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
