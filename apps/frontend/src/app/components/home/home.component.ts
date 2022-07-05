import { Component, OnInit } from '@angular/core';
import { TweetsResponse } from '@botmind-twitter-nx/api-interface';
import { TweetService } from '../../service/tweet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  data!: TweetsResponse;

  constructor(private tweetsService: TweetService) {}

  ngOnInit(): void {
    this.getTweets();
  }

  getTweets() {
    this.tweetsService.getTweets().subscribe((data) => (this.data = data));
  }
}
