import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import {  ApiPropertyOptional } from '@nestjs/swagger';

export class TweetDtoQuery {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({
    type: Number,
    description: 'This is a optionnal property to indicate the number of tweets to fetch.',
  })
  public count = 10;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({
    type: Number,
    description: 'This is a optionnal property to specify how many tweets to skip.',
  })
  public offset = 0;
}
