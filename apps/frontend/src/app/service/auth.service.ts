import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  SignInDtoRequest,
  SignInResponse,
  SignUpDtoRequest,
  SignUpResponse,
  UserProfileResponse,
} from '@botmind-twitter-nx/api-interface';
import { Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { environment as env } from '../../environments/environment';
import { Emitters } from '../emitters/emitters';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser!: UserProfileResponse;

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
  ) {}

  signUp(user: SignUpDtoRequest) {
    return this.http.post<SignUpResponse>(`${env.apiEndPoint}/auth/signup`, user);
  }

  signIn(user: SignInDtoRequest) {
    return this.http.post<SignInResponse>(`${env.apiEndPoint}/auth/signin`, user);
  }

  getUserProfile(): Observable<UserProfileResponse> {
    const api = `${env.apiEndPoint}/users/me`;
    return this.http.get<UserProfileResponse>(api, {
      headers: this.jwtService.getHeaderWithToken(),
    });
  }

  logout() {
    this.jwtService.deleteToken();
    Emitters.authEmitter.emit(false);
  }

  resumeSession() {
    if (this.jwtService.getToken() !== null) {
      Emitters.authEmitter.emit(true);
    } else {
      Emitters.authEmitter.emit(false);
    }
  }
}
