import { Component, OnInit } from '@angular/core';
import { Tweet } from '@botmind-twitter-nx/api-interface';
import { map } from 'rxjs';
import { Emitters } from '../../emitters/emitters';
import { TweetService } from '../../service/tweet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tweets: Tweet[] = [];
  totalTweets = 0;
  tweetsPerCall = 10;
  offset = 0;
  isUserLoggedIn = false;

  constructor(private tweetsService: TweetService) {}

  ngOnInit(): void {
    this.getTweets();
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserLoggedIn = auth;
    });
  }

  getTweets() {
    this.tweetsService
      .getTweets({ count: this.tweetsPerCall, offset: this.offset }, this.isUserLoggedIn)
      // Order replies by date DESC
      .pipe(
        map((res) => {
          console.log(
            res.tweets.map((t) =>
              t.replies.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              )
            )
          );
          return res;
        })
      )
      .subscribe((res) => {
        this.tweets = this.tweets.concat(res.tweets);
        this.totalTweets = res.totalTweets;
        this.offset += this.tweetsPerCall;
      });
  }

  onScroll() {
    if (this.totalTweets >= this.offset) {
      this.getTweets();
    }
  }
}
