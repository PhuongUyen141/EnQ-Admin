import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../environments/environment';
import { AdminUser } from '../Core/Interfaces/AdminUser.interface';
import { concatAll, map, take, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: string = null;
  isLogging = false;
  user: any = null;

  constructor(private httpClient: HttpClient) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
  }

  logIn(userName: string, password: string): Observable<unknown> {
    const outer$ = this.httpClient
      .post(API + 'users/admin/login', {
        userName,
        password,
      })
      .pipe(
        take(1),
        tap((res: any) => {
          if (res.error) {
            throw new Error('Failed to login');
          }
          this.token = res.token;
        }),
      );


    const combined$ = outer$.pipe(
      map((res) => {
        return this.getAdminUserInfo(res.token);
      }),
      concatAll()
    );
    return combined$;
  }

  signUp(obj: AdminUser): Observable<unknown> {
    const outer$ = this.httpClient.post(API + 'users/admin/signup', obj).pipe(
      take(1),
      tap((res: any) => {
        this.token = res.token;
      })
    );

    const combined$ = outer$.pipe(
      map((res) => this.getAdminUserInfo(res.token)),
      concatAll()
    );
    return combined$;
  }

  signOut(): void {
    this.token = null;
    this.user = null;
  }

  getToken(): string {
    return this.token;
  }

  private getAdminUserInfo(token: string): Observable<unknown> {
    const httpOptions = {
      headers: new HttpHeaders({
        token,
      }),
    };
    return this.httpClient
      .post(API + 'users/admin/logedin', {}, httpOptions)
      .pipe(
        take(1),
        tap((user) => {
          if (!user) {
            throw new Error('Failed to get user');
          }
          this.user = user;
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  getUser(): unknown {
    if (this.user && this.token) {
      return {
        token: this.token,
        ...this.user,
      };
    }
    return null;
  }
}
