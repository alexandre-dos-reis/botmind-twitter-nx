import { Component, Input, OnInit } from '@angular/core';
import { Tweet } from '@botmind-twitter-nx/api-interface';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
})
export class TweetComponent implements OnInit {
  @Input() tweet!: Tweet;
  public isCollapsed = true;

  constructor() {}

  ngOnInit(): void {
    
  }
}
