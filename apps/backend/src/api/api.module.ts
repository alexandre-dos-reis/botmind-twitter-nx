import { Module } from '@nestjs/common';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TweetModule, UserModule],
})
export class ApiModule {}
