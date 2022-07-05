import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '../entities';
import { TweetDtoRequest } from '@botmind-twitter-nx/api-interface';
import { TweetService } from './tweet.service';
import { TweetsResponse } from '@botmind-twitter-nx/api-interface';

@Controller('tweets')
@UseGuards(JwtGuard)
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@GetUser() user: User): Promise<TweetsResponse> {
    const tweets = await this.tweetService.findAll(user);
    return {
      tweetsCount: tweets.length,
      tweets,
    };
  }

  @Delete(':id')
  delete(@GetUser() user: User, @Param('id') id: number) {
    return this.tweetService.delete(user, id);
  }

  @Patch(':id')
  update(@GetUser() user: User, @Body() dto: TweetDtoRequest, @Param('id') id: number) {
    return this.tweetService.update(user, dto, id);
  }

  @Post()
  create(@GetUser() user: User, @Body() dto: TweetDtoRequest) {
    return this.tweetService.create(user, dto);
  }

  // Likes
  @Post(':id/like')
  like(@GetUser() user: User, @Param('id') id: number) {
    return this.tweetService.like(user, id);
  }

  // Subscription to users
  // @Post(':id/subscribe')
  // subscribe(@GetUser() user: User, @Param('id') id: number) {
  //   return {};
  // }
}
