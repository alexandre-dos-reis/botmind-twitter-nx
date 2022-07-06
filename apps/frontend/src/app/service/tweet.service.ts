import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TweetDtoQuery, TweetsResponse } from '@botmind-twitter-nx/api-interface';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class TweetService {
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getTweets(dto: TweetDtoQuery, isUserLoggedIn: boolean): Observable<TweetsResponse> {
    return this.http.get<TweetsResponse>(`${env.apiEndPoint}/tweets`, {
      params: new HttpParams().append('count', dto.count).append('offset', dto.offset),
      headers: isUserLoggedIn ? this.jwtService.getHeaderWithToken() : {},
    });
  }
}
