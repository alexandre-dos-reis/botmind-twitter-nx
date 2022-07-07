import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServerError, Tweet, TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { TweetService } from '../../service/tweet.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
})
export class TweetComponent implements OnInit {
  @Input() tweet!: Tweet;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  isCollapsed = true;
  isUserLoggedIn = false;
  formReply!: FormGroup;
  errors!: FormErrors;

  constructor(
    private tweetService: TweetService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    Emitters.authEmitter.subscribe((auth: boolean) => (this.isUserLoggedIn = auth));
  }

  ngOnInit(): void {
    this.authService.resumeSession();
    this.isCurrentUserHasLiked = this.tweet.isCurrentUserHasLiked;
    this.likesCount = this.tweet.likesCount;

    const formItems = {
      content: '',
    };

    this.formReply = this.formBuilder.group({
      ...formItems,
    } as TweetDtoRequest);

    this.errors = createErrorItems(formItems);
  }

  handleLike(e: MouseEvent): void {
    if (this.isUserLoggedIn) {
      e.stopPropagation();
      this.tweetService.handleLike(this.tweet).subscribe((res) => {
        this.isCurrentUserHasLiked = res.isLiked;
        this.likesCount += res.isLiked ? 1 : -1;
      });
    }
  }

  handleEditMode(e: MouseEvent) {
    //this.showEditor = true;
  }

  handleNewReply() {
    this.tweetService
      .createReply(this.tweet, this.formReply.getRawValue() as TweetDtoRequest)
      .subscribe({
        next: (res) => {
          this.tweet.replies.push(res.reply);
          this.formReply.reset();
        },
        error: ({ error }: { error: ServerError }) => {
          handleServerError(error, this.errors, this.messageService);
        },
      });
  }
}
