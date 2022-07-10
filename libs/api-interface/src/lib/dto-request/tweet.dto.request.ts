import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TweetDtoRequest {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
