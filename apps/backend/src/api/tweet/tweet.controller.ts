import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { Tweet, User } from '../entities';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  async findAll() {
    return await this.tweetService.findAll();
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@GetUser() user: User, @Param('id') id: number) {
    return this.tweetService.delete(user, id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@GetUser() user: User, @Body() tweet: Tweet) {
    return this.tweetService.update(user, tweet);
  }
}
