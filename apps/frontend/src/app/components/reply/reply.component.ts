import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Reply, ServerError, TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Subscription } from 'rxjs';
import { FormErrors } from '../../helpers/types';
import { MessageService } from '../../service/message.service';
import { ServerErrorService } from '../../service/server-error.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit, OnDestroy {
  @Input() reply!: Reply;
  @Input() isUserLoggedIn = false;
  @Output() delete: EventEmitter<Reply> = new EventEmitter();
  isCurrentUserHasLiked = false;
  likesCount!: number;
  isUserTheAuthor = false;
  editMode = false;

  formEdit!: UntypedFormGroup;
  formEditErrors!: FormErrors;

  subs: Subscription[] = [];

  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private formBuilder: UntypedFormBuilder,
    private messageService: MessageService,
    private serverErrorService: ServerErrorService
  ) {}

  ngOnInit(): void {
    if (this.isUserLoggedIn && this.reply.author.id === this.userService.getUser()?.id) {
      this.isUserTheAuthor = true;
    }

    this.isCurrentUserHasLiked = this.reply.isCurrentUserHasLiked;
    this.likesCount = this.reply.likesCount;

    const formItemsEdit = {
      content: this.reply.content,
    };

    this.formEdit = this.formBuilder.group({
      ...formItemsEdit,
    } as TweetDtoRequest);

    this.formEditErrors = this.serverErrorService.createOrReset(formItemsEdit);
  }

  ngOnDestroy(): void {
    this.subs.map((s) => s.unsubscribe());
  }

  handleLike(event: MouseEvent) {
    if (this.isUserLoggedIn) {
      event.stopPropagation();
      this.subs.push(
        this.tweetService.handleLike(this.reply).subscribe((res) => {
          this.isCurrentUserHasLiked = res.isLiked;
          this.likesCount += res.isLiked ? 1 : -1;
        })
      );
    }
  }

  handleCancelEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = false;
    this.formEdit.patchValue({
      content: this.reply.content,
    });
  }

  onEdit(e: MouseEvent) {
    e.stopPropagation();
    this.editMode = true;
  }

  onDelete(e: MouseEvent) {
    e.stopPropagation();
    this.subs.push(
      this.tweetService.deleteTweet(this.reply).subscribe((res) => {
        if (res.isTweetDeleted === true) {
          this.delete.emit(this.reply);
          this.messageService.add({
            message: 'La réponse a bien été supprimé.',
            type: 'success',
          });
        }
      })
    );
  }

  doEdit() {
    this.subs.push(
      this.tweetService
        .editReply(this.reply, this.formEdit.getRawValue() as TweetDtoRequest)
        .subscribe({
          next: (res) => {
            this.reply = res.tweet; // This is a reply !;
            this.editMode = false;
            this.formEditErrors = this.serverErrorService.createOrReset(this.formEditErrors)
            this.messageService.add({
              message: 'La réponse a bien été modifié.',
              type: 'success',
            });
          },
          error: ({ error }: { error: ServerError }) => {
            this.formEditErrors = this.serverErrorService.handleError(error, this.formEditErrors);
          },
        })
    );
  }
}
