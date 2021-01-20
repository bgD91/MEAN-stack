import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: Boolean = false;

  private $authStatus: Subscription;

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    this.$authStatus = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
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

  ngOnDestroy(): void {
    this.$authStatus.unsubscribe();
  }

}
