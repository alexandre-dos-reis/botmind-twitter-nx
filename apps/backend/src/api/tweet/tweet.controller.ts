import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '../entities';
import { TweetDto } from './dto';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  findAll() {
    return this.tweetService.findAll();
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@GetUser() user: User, @Param('id') id: number) {
    return this.tweetService.delete(user, id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@GetUser() user: User, @Body() dto: TweetDto, @Param('id') id: number) {
    console.log(id);
    return this.tweetService.update(user, dto, id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: User, @Body() dto: TweetDto) {
    return this.tweetService.create(user, dto);
  }
}
