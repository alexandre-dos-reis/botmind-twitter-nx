import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Reply, ServerError, Tweet, TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Subscription } from 'rxjs';
import { FormErrors } from '../../helpers/types';
import { MessageService } from '../../service/message.service';
import { ServerErrorService } from '../../service/server-error.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
})
export class TweetComponent implements OnInit, OnDestroy {
  @Input() tweet!: Tweet;
  @Input() isUserLoggedIn = false;
  @Output() delete: EventEmitter<Tweet> = new EventEmitter();

  isUserTheAuthor = false;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  repliesCount!: number;
  isCollapsed = true;
  editMode = false;
  showEditorReply = true;
  replies: Reply[] = [];

  formReply!: FormGroup;
  formReplyErrors!: FormErrors;

  formEdit!: FormGroup;
  formEditErrors!: FormErrors;

  subs: Subscription[] = [];

  constructor(
    private tweetService: TweetService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private userService: UserService,
    private serverErrorService: ServerErrorService
  ) {}

  ngOnInit(): void {
    if (this.isUserLoggedIn && this.tweet.author.id === this.userService.getUser()?.id) {
      this.isUserTheAuthor = true;
    }

    this.isCurrentUserHasLiked = this.tweet.isCurrentUserHasLiked;
    this.likesCount = this.tweet.likesCount;
    this.repliesCount = this.tweet.repliesCount;
    this.replies = this.tweet.replies;

    const formItemsReply = {
      content: '',
    };

    this.formReply = this.formBuilder.group({
      ...formItemsReply,
    } as TweetDtoRequest);

    this.formReplyErrors = this.serverErrorService.createOrReset(formItemsReply);

    const formItemsEdit = {
      content: this.tweet.content,
    };

    this.formEdit = this.formBuilder.group({
      ...formItemsEdit,
    } as TweetDtoRequest);

    this.formEditErrors = this.serverErrorService.createOrReset(formItemsEdit)
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  handleLike(e: MouseEvent): void {
    if (this.isUserLoggedIn) {
      e.stopPropagation();
      this.subs.push(
        this.tweetService.handleLike(this.tweet).subscribe((res) => {
          this.isCurrentUserHasLiked = res.isLiked;
          this.likesCount += res.isLiked ? 1 : -1;
        })
      );
    }
  }

  onEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = true;
    this.showEditorReply = false;
  }

  onDelete(e: MouseEvent) {
    e.stopPropagation();
    this.subs.push(
      this.tweetService.deleteTweet(this.tweet).subscribe((res) => {
        if (res.isTweetDeleted === true) {
          this.delete.emit(this.tweet);
          this.messageService.add({
            message: 'Le tweet a bien été supprimé.',
            type: 'success',
          });
        }
      })
    );
  }

  handleCancelEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = false;
    this.showEditorReply = true;
    this.formEdit.patchValue({
      content: this.tweet.content,
    });
  }

  doEdit() {
    this.subs.push(
      this.tweetService
        .editTweet(this.tweet, this.formEdit.getRawValue() as TweetDtoRequest)
        .subscribe({
          next: (res) => {
            this.tweet = res.tweet;
            this.editMode = false;
            this.showEditorReply = true;
            this.formEditErrors = this.serverErrorService.createOrReset(this.formEditErrors)
            this.messageService.add({
              message: 'Le tweet a bien été modifié.',
              type: 'success',
            });
          },
          error: ({ error }: { error: ServerError }) => {
            this.formEditErrors = this.serverErrorService.handleError(error, this.formEditErrors);
          },
        })
    );
  }

  handleNewReply() {
    this.subs.push(
      this.tweetService
        .createReply(this.tweet, this.formReply.getRawValue() as TweetDtoRequest)
        .subscribe({
          next: (res) => {
            this.replies.push(res.reply);
            this.repliesCount += 1;
            this.formReply.reset();
            this.formReplyErrors = this.serverErrorService.createOrReset(this.formReplyErrors)
            this.messageService.add({
              message: 'Votre réponse a bien été publié.',
              type: 'success',
            });
          },
          error: ({ error }: { error: ServerError }) => {
            this.formReplyErrors = this.serverErrorService.handleError(error, this.formReplyErrors);
          },
        })
    );
  }

  onDeleteReply(reply: Reply) {
    this.replies = this.replies.filter((r) => r.id !== reply.id);
    this.repliesCount -= 1;
  }
}