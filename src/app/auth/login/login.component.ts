import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: Boolean = false;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onLogin(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.loginUser(
      registerForm.value.email,
      registerForm.value.password
    );
  }

}