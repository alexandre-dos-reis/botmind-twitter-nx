import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignInResponse } from '@botmind-twitter-nx/api-interface';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private accessTokenKey = 'access_token';

  setToken(res: SignInResponse) {
    localStorage.setItem(this.accessTokenKey, res.access_token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }
  deleteToken() {
    localStorage.removeItem(this.accessTokenKey);
  }

  getHeaderWithToken() {
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`),
    };
  }
}
