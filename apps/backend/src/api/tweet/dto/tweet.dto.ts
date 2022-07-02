import { IsNotEmpty, IsNumber } from 'class-validator';

export class TweetDto {
  @IsNumber()
  @IsNotEmpty()
  tweetId: string;
}
