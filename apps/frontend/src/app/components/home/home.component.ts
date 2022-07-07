import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TweetDtoRequest, Tweet, ServerError } from '@botmind-twitter-nx/api-interface';
import { map } from 'rxjs';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
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
  form!: FormGroup;
  errors!: FormErrors;

  constructor(
    private tweetsService: TweetService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserLoggedIn = auth;
    });
  }

  ngOnInit(): void {
    this.authService.resumeSession();
    this.getTweets();

    const formItems = {
      content: '',
    };

    this.form = this.formBuilder.group({
      ...formItems,
    } as TweetDtoRequest);

    this.errors = createErrorItems(formItems);
  }

  getTweets() {
    this.tweetsService
      .getTweets({ count: this.tweetsPerCall, offset: this.offset })
      // Order replies by date DESC
      .pipe(
        map((res) => {
          res.tweets.map((t) =>
            t.replies.sort(
              (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
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

  onSubmit() {
    this.tweetsService.createTweet(this.form.getRawValue() as TweetDtoRequest).subscribe({
      next: (res) => {
        this.tweets.unshift(res.tweet);
        this.form.reset();
      },
      error: ({ error }: { error: ServerError }) => {
        handleServerError(error, this.errors, this.messageService);
      },
    });
  }
}
