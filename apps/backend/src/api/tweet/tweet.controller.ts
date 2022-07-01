import { Controller, Get } from '@nestjs/common';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  findAll() {
    return this.tweetService.findAll();
  }
}
