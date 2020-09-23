import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../environments/environment';
import { AdminUser } from '../Core/Interfaces/AdminUser.interface';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string = null;
  isLogging = false;
  constructor(private httpClient: HttpClient) { }

  logIn(userName: string, password: string): Observable<unknown> {
    return this.httpClient.post(API + 'users/admin/login', {
      userName, password
    }).pipe(take(1), map((res: any) => {
      this.token = res.token;
      return res;
    }));
  }

  signUp(obj: AdminUser): Observable<unknown> {
    return this.httpClient.post(API + 'users/admin/signup', obj).pipe(take(1), map((res: any) => {
      this.token = res.token;
      return res;
    }));
  }

  signOut(): void {
    this.token = null;
  }

  getToken(): string {
    return this.token;
  }

}
