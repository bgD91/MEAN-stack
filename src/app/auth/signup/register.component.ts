import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading: Boolean = false;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    // this.isLoading = true;
  }

  onRegister(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.createUser(
      registerForm.value.email,
      registerForm.value.password
    );
  }

}
