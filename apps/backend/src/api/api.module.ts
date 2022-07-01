import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TweetModule } from './tweet/tweet.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, TweetModule, UserModule],
})
export class ApiModule {}
