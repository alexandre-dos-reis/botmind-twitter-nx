import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TweetDtoQuery,
  TweetDtoRequest,
  TweetsResponse,
  CreateTweetResponse,
  HandleLikeResponse,
  Tweet,
  Reply,
  CreateReplyResponse,
} from '@botmind-twitter-nx/api-interface';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { Emitters } from '../emitters/emitters';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  private isUserLoggedIn = false;

  constructor(private http: HttpClient, private jwtService: JwtService) {
    Emitters.authEmitter.subscribe((auth: boolean) => (this.isUserLoggedIn = auth));
  }

  getTweets(dto: TweetDtoQuery): Observable<TweetsResponse> {
    return this.http.get<TweetsResponse>(`${env.apiEndPoint}/tweets`, {
      params: new HttpParams().append('count', dto.count).append('offset', dto.offset),
      headers: this.isUserLoggedIn ? this.jwtService.getHeaderWithToken() : {},
    });
  }

  createTweet(dto: TweetDtoRequest): Observable<CreateTweetResponse> {
    return this.http.post<CreateTweetResponse>(
      `${env.apiEndPoint}/tweets`,
      {
        content: dto.content,
      },
      { headers: this.jwtService.getHeaderWithToken() }
    );
  }

  createReply(tweet: Tweet, dto: TweetDtoRequest): Observable<CreateReplyResponse> {
    return this.http.post<CreateReplyResponse>(
      `${env.apiEndPoint}/tweets/${tweet.id}/reply`,
      {
        content: dto.content,
      },
      { headers: this.jwtService.getHeaderWithToken() }
    );
  }

  handleLike(tweet: Tweet | Reply): Observable<HandleLikeResponse> {
    return this.http.patch<HandleLikeResponse>(
      `${env.apiEndPoint}/tweets/${tweet.id}/like`,
      {},
      { headers: this.jwtService.getHeaderWithToken() }
    );
  }
}
