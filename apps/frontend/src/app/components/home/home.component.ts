import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TweetDtoRequest, Tweet, ServerError } from '@botmind-twitter-nx/api-interface';
import { Subscription } from 'rxjs';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  tweets: Tweet[] = [];
  totalTweets = 0;
  tweetsPerCall = 10;
  offset = 0;
  isUserLoggedIn = false;
  isLoading = true;
  userId!: number;
  form!: FormGroup;
  errors!: FormErrors;
  subs: Subscription[] = [];

  constructor(
    private tweetsService: TweetService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      Emitters.authEmitter.subscribe((auth: boolean) => {
        if (auth) {
          this.userId = this.userService.getUser()?.id
          this.isUserLoggedIn = auth;
        }
      })
    );
    this.authService.resumeSession();

    console.log('>>> NG_BACKEND_API', process.env['NG_BACKEND_API']);

    this.getTweets();

    const formItems = {
      content: '',
    };

    this.form = this.formBuilder.group({
      ...formItems,
    } as TweetDtoRequest);

    this.errors = createErrorItems(formItems);
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
    this.tweets = [];
  }

  getTweets() {
    this.subs.push(
      this.tweetsService
        .getTweets({ count: this.tweetsPerCall, offset: this.offset }, this.isUserLoggedIn)
        .subscribe((res) => {
          this.tweets = this.tweets.concat(res.tweets);
          this.totalTweets = res.totalTweets;
          this.offset += this.tweetsPerCall;
          this.isLoading = false;
        })
    );
  }

  onScroll() {
    if (this.totalTweets >= this.offset) {
      this.getTweets();
    }
  }

  onSubmit() {
    this.subs.push(
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
      })
    );
  }

  onDeleteTweet(tweet: Tweet) {
    this.tweets = this.tweets.filter((t) => t.id !== tweet.id);
  }
}
