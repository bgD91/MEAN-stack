import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {
    this.$authStatus.unsubscribe();
  }

}
