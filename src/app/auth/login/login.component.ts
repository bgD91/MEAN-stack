import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: Boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    // this.isLoading = true;
  }

  onLogin(form: NgForm) {
    console.log(form.value);
  }

}
