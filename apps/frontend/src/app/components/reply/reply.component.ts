import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Reply, ServerError, TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { handleServerError } from '../../helpers/Errors/handleServerError';
import { createErrorItems } from '../../helpers/Form';
import { FormErrors } from '../../helpers/types';
import { AuthService } from '../../service/auth.service';
import { MessageService } from '../../service/message.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit {
  @Input() reply!: Reply;
  @Output() delete: EventEmitter<Reply> = new EventEmitter();
  isUserLoggedIn = false;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  isUserTheAuthor = false;
  editMode = false;

  formEdit!: FormGroup;
  formEditErrors!: FormErrors;

  constructor(
    private tweetService: TweetService,
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isUserLoggedIn = auth;
      if (this.isUserLoggedIn && this.reply.author.id === this.userService.getUser()?.id) {
        this.isUserTheAuthor = true;
      }
    });
    this.authService.resumeSession();
    this.isCurrentUserHasLiked = this.reply.isCurrentUserHasLiked;
    this.likesCount = this.reply.likesCount;

    const formItemsEdit = {
      content: this.reply.content,
    };

    this.formEdit = this.formBuilder.group({
      ...formItemsEdit,
    } as TweetDtoRequest);

    this.formEditErrors = createErrorItems(formItemsEdit);
  }

  handleLike(event: MouseEvent) {
    if (this.isUserLoggedIn) {
      event.stopPropagation();
      this.tweetService.handleLike(this.reply).subscribe((res) => {
        this.isCurrentUserHasLiked = res.isLiked;
        this.likesCount += res.isLiked ? 1 : -1;
      });
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
    this.tweetService.deleteTweet(this.reply).subscribe((res) => {
      if (res.isTweetDeleted === true) {
        this.delete.emit(this.reply);
        this.messageService.add({
          message: 'La réponse a bien été supprimé.',
          type: 'success',
        });
      }
    });
  }

  doEdit() {
    this.tweetService
      .editReply(this.reply, this.formEdit.getRawValue() as TweetDtoRequest)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.reply = res.tweet // This is a reply !;
          this.editMode = false;
          this.messageService.add({
            message: 'La réponse a bien été modifié.',
            type: 'success',
          });
        },
        error: ({ error }: { error: ServerError }) => {
          handleServerError(error, this.formEditErrors, this.messageService);
        },
      });
  }
}
