import { IsNotEmpty, IsString } from 'class-validator';

export class TweetDtoRequest {
  @IsString()
  @IsNotEmpty()
  content!: string;
}
