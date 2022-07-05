import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  SignInDtoRequest,
  SignInResponse,
  SignUpDtoRequest,
  SignUpResponse,
  UserProfileResponse,
} from '@botmind-twitter-nx/api-interface';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = 'http://localhost:3333/api';
  accessTokenKey = 'access_token';
  currentUser!: UserProfileResponse;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  signUp(user: SignUpDtoRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.endpoint}/auth/signup`, user);
  }

  signIn(user: SignInDtoRequest): Subscription {
    const api = `${this.endpoint}/auth/signin`;
    return this.http.post<SignInResponse>(api, user).subscribe((res: SignInResponse) => {
      localStorage.setItem(this.accessTokenKey, res.access_token);
      this.getUserProfile().subscribe((res: UserProfileResponse) => {
        this.currentUser = res;
        this.router.navigate(['/']);
      });
    });
  }

  getUserProfile(): Observable<UserProfileResponse> {
    const api = `${this.endpoint}/users/me`;
    return this.http.get<UserProfileResponse>(api, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.getToken}`),
    });
  }

  logout() {
    localStorage.removeItem(this.accessTokenKey);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  get isLoggedIn(): boolean {
    return this.getToken() !== null ? true : false;
  }
}
