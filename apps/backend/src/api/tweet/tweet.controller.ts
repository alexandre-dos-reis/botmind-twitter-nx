import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '../entities';
import {
  TweetDtoRequest,
  TweetsResponse,
  TweetDtoQuery,
  CreateTweetResponse,
  HandleLikeResponse,
  CreateReplyResponse,
  EditTweetResponse,
  DeleteTweetResponse,
} from '@botmind-twitter-nx/api-interface';
import { TweetService } from './tweet.service';

@Controller('tweets')
@UseGuards(JwtGuard)
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@GetUser() user: User, @Query() dto: TweetDtoQuery): Promise<TweetsResponse> {
    return {
      totalTweets: await this.tweetService.countAllTweets(),
      tweets: await this.tweetService.findByQuery(dto, user),
    };
  }

  @Delete(':id')
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<DeleteTweetResponse> {
    return {
      isTweetDeleted: await this.tweetService.delete(user, id),
    };
  }

  @Patch(':id')
  async update(
    @GetUser() user: User,
    @Body() dto: TweetDtoRequest,
    @Param('id') id: number
  ): Promise<EditTweetResponse> {
    return {
      tweet: await this.tweetService.update(user, dto, id),
    };
  }

  @Post()
  async create(@GetUser() user: User, @Body() dto: TweetDtoRequest): Promise<CreateTweetResponse> {
    return {
      tweet: await this.tweetService.create(user, dto),
    };
  }

  @Post(':id/reply')
  async createReply(
    @GetUser() user: User,
    @Param('id') tweetId: number,
    @Body() dto: TweetDtoRequest
  ): Promise<CreateReplyResponse> {
    return {
      reply: await this.tweetService.createReply(user, tweetId, dto),
    };
  }

  // Likes
  @Patch(':id/like')
  async like(@GetUser() user: User, @Param('id') id: number): Promise<HandleLikeResponse> {
    return this.tweetService.like(user, id);
  }
}
