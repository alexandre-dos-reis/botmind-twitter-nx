import { Component, Input, OnInit } from '@angular/core';
import { Reply } from '@botmind-twitter-nx/api-interface';
import { Emitters } from '../../emitters/emitters';
import { AuthService } from '../../service/auth.service';
import { TweetService } from '../../service/tweet.service';

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
})
export class ReplyComponent implements OnInit {
  @Input() reply!: Reply;
  isCurrentUserHasLiked = false;
  likesCount!: number;
  isUserLoggedIn = false;

  constructor(private tweetService: TweetService, private authService: AuthService) {
    Emitters.authEmitter.subscribe((auth: boolean) => (this.isUserLoggedIn = auth));
  }

  ngOnInit(): void {
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
