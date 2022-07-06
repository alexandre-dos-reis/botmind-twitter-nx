import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TweetDtoQuery {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  public count = 10;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public offset = 0;
}
