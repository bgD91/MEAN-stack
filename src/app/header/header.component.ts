import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private $authListener: Subscription;
  userIsAuthenticated = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.$authListener =
      this.authService.getAuthStatusListener()
        .subscribe(
      isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    this.$authListener.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
}
