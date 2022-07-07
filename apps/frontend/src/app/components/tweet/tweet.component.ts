import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ServerError, Tweet, TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
})
export class TweetComponent implements OnInit {
  @Output() delete: EventEmitter<Tweet> = new EventEmitter();
  @Input() tweet!: Tweet;
  isUserTheAuthor = false;
  isUserLoggedIn = false;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  repliesCount!: number;
  isCollapsed = true;
  editMode = false;

  formReply!: FormGroup;
  formReplyErrors!: FormErrors;

  formEdit!: FormGroup;
  formEditErrors!: FormErrors;

  constructor(
    private tweetService: TweetService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserLoggedIn = auth;
      if (this.isUserLoggedIn && this.tweet.author.id === this.userService.getUser()?.id) {
        this.isUserTheAuthor = true;
      }
    });
    this.authService.resumeSession();
    this.isCurrentUserHasLiked = this.tweet.isCurrentUserHasLiked;
    this.likesCount = this.tweet.likesCount;
    this.repliesCount = this.tweet.repliesCount

    const formItemsReply = {
      content: '',
    };

    this.formReply = this.formBuilder.group({
      ...formItemsReply,
    } as TweetDtoRequest);

    this.formReplyErrors = createErrorItems(formItemsReply);

    const formItemsEdit = {
      content: this.tweet.content,
    };

    this.formEdit = this.formBuilder.group({
      ...formItemsEdit,
    } as TweetDtoRequest);

    this.formEditErrors = createErrorItems(formItemsEdit);
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

  onEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = true;
  }

  onDelete(e: MouseEvent) {
    e.stopPropagation();
    this.tweetService.deleteTweet(this.tweet).subscribe((res) => {
      if (res.isTweetDeleted === true) {
        this.delete.emit(this.tweet);
        this.messageService.add({
          message: 'Le tweet a bien été supprimé.',
          type: 'success'
        })
      }
    });
  }

  // confirmDelete(name: string, e: MouseEvent) {
  //   e.stopPropagation()
  // }

  handleCancelEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = false;
    this.formEdit.patchValue({
      content: this.tweet.content,
    });
  }

  doEdit() {
    this.tweetService
      .editTweet(this.tweet, this.formEdit.getRawValue() as TweetDtoRequest)
      .subscribe({
        next: (res) => {
          this.tweet = res.tweet;
          this.editMode = false;
          this.messageService.add({
            message: 'Le tweet a bien été modifié.',
            type: 'success'
          })
        },
        error: ({ error }: { error: ServerError }) => {
          handleServerError(error, this.formReplyErrors, this.messageService);
        },
      });
  }

  handleNewReply() {
    this.tweetService
      .createReply(this.tweet, this.formReply.getRawValue() as TweetDtoRequest)
      .subscribe({
        next: (res) => {
          this.tweet.replies.push(res.reply);
          this.repliesCount += 1
          this.formReply.reset();
          this.messageService.add({
            message: 'Votre réponse a bien été publié.',
            type: 'success'
          })
          
        },
        error: ({ error }: { error: ServerError }) => {
          handleServerError(error, this.formReplyErrors, this.messageService);
        },
      });
  }
}
