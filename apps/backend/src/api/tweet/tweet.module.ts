import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetController } from './tweet.controller';
import { Tweet } from '../entities/tweet.entity';
import { TweetService } from './tweet.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  providers: [TweetService],
  controllers: [TweetController],
})
export class TweetModule {}
