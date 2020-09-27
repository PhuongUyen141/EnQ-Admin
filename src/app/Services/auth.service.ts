import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../environments/environment';
import { AdminUser } from '../Core/Interfaces/AdminUser.interface';
import { concatAll, map, take, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = null;
  isLogging = false;
  user;
  constructor(private httpClient: HttpClient) { }

  logIn(userName: string, password: string): Observable<unknown> {
    const outer$ = this.httpClient.post(API + 'users/admin/login', {
      userName, password
    }).pipe(take(1), tap((res: any) => {
      this.token = res.token;
    }));

    const combined$ = outer$.pipe(map(res => this.getAdminUserInfo(res.token).pipe(take(1), tap(user => {
      this.user = user;
    }))), concatAll());
    return combined$;
  }


  signUp(obj: AdminUser): Observable<unknown> {
    const outer$ = this.httpClient.post(API + 'users/admin/signup', obj).pipe(take(1), tap((res: any) => {
      this.token = res.token;
    }));

    const combined$ = outer$.pipe(map(res => this.getAdminUserInfo(res.token).pipe(take(1), tap(user => {
      this.user = user;
    }))), concatAll());
    return combined$;
  }

  // signUp(obj: AdminUser): Observable<unknown> {
  //   return this.httpClient.post(API + 'users/admin/signup', obj).pipe(take(1), tap((res: any) => {
  //     this.token = res.token;
  //   }));
  // }

  signOut(): void {
    this.token = null;
  }

  getToken(): string {
    return this.token;
  }

  private getAdminUserInfo(token): Observable<unknown> {
    const httpOptions = {
      headers: new HttpHeaders({
        // tslint:disable-next-line: object-literal-key-quotes
        'token': token
      })
    };
    return this.httpClient.post(API + 'users/admin/logedin', {}, httpOptions);
  }

}
