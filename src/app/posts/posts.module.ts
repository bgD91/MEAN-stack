import {NgModule} from '@angular/core';
import {PostCreateComponent} from './post-create/post-create.component';
import {PostListComponent} from './post-list/post-list.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from '../angular-material.module';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    RouterModule
  ],
  declarations: [
    PostCreateComponent,
    PostListComponent
  ]
})

export class PostsModule {
}
