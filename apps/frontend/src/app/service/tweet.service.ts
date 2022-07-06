import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TweetsResponse } from '@botmind-twitter-nx/api-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  endpoint = 'http://localhost:3333/api';
  accessTokenKey = 'access_token';

  constructor(
    private http: HttpClient,
    // private router: Router,
    // private messageService: MessageService
  ) {}

  getTweets(): Observable<TweetsResponse> {
    return this.http.get<TweetsResponse>(`${this.endpoint}/tweets`);
  }
}
