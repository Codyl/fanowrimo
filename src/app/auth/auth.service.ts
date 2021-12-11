import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private userId: string;
  private authStatusListener = new Subject<boolean>();
  private userFamilies: string[];

  constructor(private httpClient: HttpClient, private router: Router) {}

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
    const AuthData: AuthData = { email: email, password: password };
    return this.httpClient
      .post('http://localhost:3000/api/user/signup', AuthData)
      .subscribe(() => {
        this.router.navigate(['/login']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string, userFamilies: string[] }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          console.log(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.userFamilies = response.userFamilies;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          // console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiration.getTime() - now.getTime();
    //if expiration date is not in the past
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userFamilies = authInformation.userFamilies;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userFamilies', JSON.stringify(this.userFamilies));
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userFamilies');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userFamilies = JSON.parse(localStorage.getItem('userFamilies'));
    console.log(userFamilies, "families from localstorage")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expiration: new Date(expirationDate),
      userId: userId,
      userFamilies: userFamilies
    };
  }
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getUserId() {
    return this.userId;
  }
  getUserFamilies() {
    return this.userFamilies;
  }

  addFamilyToUser(familyData) {
    console.log("add family to user", familyData.id)
    return this.httpClient
      .put('http://localhost:3000/api/user', { family: familyData, userId: this.getUserId(), userFamilies: this.getUserFamilies() })
  }
}
