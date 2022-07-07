import { Injectable } from '@angular/core';
import { UserProfileResponse } from '@botmind-twitter-nx/api-interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userKey = 'user';

  constructor(private authService: AuthService) {}

  storeUser(res: UserProfileResponse) {
    localStorage.setItem(this.userKey, JSON.stringify(res));
  }

  getUser(): UserProfileResponse {
    const string = localStorage.getItem(this.userKey);
    if (string) {
      return JSON.parse(string);
    }
    this.authService.getUserProfile().subscribe((user) => this.storeUser(user));
    return JSON.parse(localStorage.getItem(this.userKey) as string);
  }

  deleteUser(): void {
    localStorage.removeItem(this.userKey);
  }
}
