import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TweetDtoRequest, Tweet, ServerError } from '@botmind-twitter-nx/api-interface';
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
  isLoading = true;
  userId!: number;
  form!: FormGroup;
  errors!: FormErrors;

  constructor(
    private tweetsService: TweetService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserLoggedIn = auth;
    });
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
      .subscribe((res) => {
        this.tweets = this.tweets.concat(res.tweets);
        this.totalTweets = res.totalTweets;
        this.offset += this.tweetsPerCall;
        this.isLoading = false;
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
        this.messageService.add({
          message: 'Votre tweet a bien été publié.',
          type: 'success',
        });
      },
      error: ({ error }: { error: ServerError }) => {
        handleServerError(error, this.errors, this.messageService);
      },
    });
  }

  onDeleteTweet(tweet: Tweet) {
    this.tweets = this.tweets.filter((t) => t.id !== tweet.id);
  }
}
