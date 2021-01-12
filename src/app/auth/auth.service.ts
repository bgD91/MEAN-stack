import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthData} from './auth-data.model';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // authUrl =
  private token: string;
  private authStatusListener = new Subject<boolean>();

  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) {
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post('http://localhost:3000/api/user/register', authData)
      .subscribe(response => {
        this.router.navigate(['/login']);
      });
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = {email, password};
    this.http.post<{ token: string }>('http://localhost:3000/api/user/login', authData)
      .subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            this.authStatusListener.next(true);
            this.isAuthenticated = true;
          }
          this.router.navigate(['/']);
        },
        error => {
          console.error(error);
        });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
