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
  EditTweetResponse,
  DeleteTweetResponse,
} from '@botmind-twitter-nx/api-interface';
import { map, Observable } from 'rxjs';
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
    return this.http
      .get<TweetsResponse>(`${env.apiEndPoint}/tweets`, {
        params: new HttpParams().append('count', dto.count).append('offset', dto.offset),
        headers: this.isUserLoggedIn ? this.jwtService.getHeaderWithToken() : {},
      }) // Order replies by date DESC
      .pipe(
        map((res) => {
          res.tweets.map((t) =>
            t.replies.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            )
          );
          return res;
        })
      );
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

  editTweet(tweet: Tweet, dto: TweetDtoRequest): Observable<EditTweetResponse> {
    return this.http.patch<EditTweetResponse>(
      `${env.apiEndPoint}/tweets/${tweet.id}`,
      {
        content: dto.content,
      },
      { headers: this.jwtService.getHeaderWithToken() }
    );
  }

  deleteTweet(tweet: Tweet): Observable<DeleteTweetResponse> {
    return this.http.delete<DeleteTweetResponse>(`${env.apiEndPoint}/tweets/${tweet.id}`, {
      headers: this.jwtService.getHeaderWithToken(),
    });
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
