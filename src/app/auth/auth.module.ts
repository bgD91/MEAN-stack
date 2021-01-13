import {NgModule} from '@angular/core';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AngularMaterialModule} from '../angular-material.module';
import {FormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {CommonModule} from '@angular/common';


@NgModule({
  imports: [
    AngularMaterialModule,
    FormsModule,
    AuthRoutingModule,
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
  ]
})

export class AuthModule {
}
