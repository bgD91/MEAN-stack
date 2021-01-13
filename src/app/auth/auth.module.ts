import {NgModule} from '@angular/core';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {AngularMaterialModule} from '../angular-material.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    AngularMaterialModule,
    FormsModule,
  ]
})

export class AuthModule {
}
