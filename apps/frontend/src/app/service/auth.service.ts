import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  SignInDtoRequest,
  SignInResponse,
  SignUpDtoRequest,
  SignUpResponse,
  UserProfileResponse,
} from '@botmind-twitter-nx/api-interface';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = 'http://localhost:3333/api';

  currentUser!: UserProfileResponse;

  constructor(private http: HttpClient, private router: Router, private jwtService: JwtService) {}

  signUp(user: SignUpDtoRequest) {
    return this.http.post<SignUpResponse>(`${this.endpoint}/auth/signup`, user);
  }

  signIn(user: SignInDtoRequest) {
    return this.http.post<SignInResponse>(`${this.endpoint}/auth/signin`, user);
  }

  getUserProfile(): Observable<UserProfileResponse> {
    const api = `${this.endpoint}/users/me`;
    return this.http.get<UserProfileResponse>(api, this.jwtService.getHeaderWithToken());
  }

  logout() {
    this.jwtService.deleteToken();
  }

  get isLoggedIn(): boolean {
    return this.jwtService.getToken() !== null ? true : false;
  }
}
