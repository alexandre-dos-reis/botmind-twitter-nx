import { Component, Input, OnInit } from '@angular/core';
import { Reply } from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { AuthService } from '../../service/auth.service';
import { TweetService } from '../../service/tweet.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit {
  @Input() reply!: Reply;
  isUserLoggedIn = false;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  isUserTheAuthor = false;

  constructor(private tweetService: TweetService, private authService: AuthService, private userService: UserService) {}

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
}
