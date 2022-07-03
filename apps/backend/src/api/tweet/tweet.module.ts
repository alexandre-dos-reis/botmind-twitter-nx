import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetController } from './tweet.controller';
import { Like, Tweet } from '../entities';
import { TweetService } from './tweet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet, Like])],
  providers: [TweetService],
  controllers: [TweetController],
})
export class TweetModule {}
