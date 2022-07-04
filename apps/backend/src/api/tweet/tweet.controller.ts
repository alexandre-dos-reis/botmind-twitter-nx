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
import { Tweet, User } from '../entities';
import { TweetDto } from './dto';
import { TweetService } from './tweet.service';

@Controller('tweets')
@UseGuards(JwtGuard)
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  findAll(@GetUser() user: User): Promise<Tweet[]> {
    return this.tweetService.findAll(user);
  }

  @Delete(':id')
  delete(@GetUser() user: User, @Param('id') id: number) {
    return this.tweetService.delete(user, id);
  }

  @Patch(':id')
  update(@GetUser() user: User, @Body() dto: TweetDto, @Param('id') id: number) {
    return this.tweetService.update(user, dto, id);
  }

  @Post()
  create(@GetUser() user: User, @Body() dto: TweetDto) {
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
