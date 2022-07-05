import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-tweet',
  templateUrl: './create-tweet.component.html',
})
export class CreateTweetComponent implements OnInit {
  tweetContent = '';

  constructor() {}

  ngOnInit(): void {}
}
