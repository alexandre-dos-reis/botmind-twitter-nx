import { IsNotEmpty, IsString } from 'class-validator';

export class TweetDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
