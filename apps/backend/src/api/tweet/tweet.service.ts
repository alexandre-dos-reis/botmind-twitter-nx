import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet, User } from '../entities';
import { TweetDto } from './dto';

@Injectable()
export class TweetService {
  constructor(@InjectRepository(Tweet) private tweetsRepo: Repository<Tweet>) {}

  async findAll(): Promise<Tweet[]> {
    const tweets = await this.tweetsRepo.find({
      relations: {
        likes: true,
        author: true,
      },
      select: {
        author: {
          id: true,
          email: true,
        },
        likes: {
          id: true,
        },
      },
    });

    // Order by number of likes DESC
    return tweets.sort((a, b) => b.likes.length - a.likes.length);
  }

  async findTweet(id: number, user: User): Promise<Tweet> {
    const tweet = await this.tweetsRepo.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!tweet) {
      throw new NotFoundException("Tweet doesn't exists !");
    }

    if (tweet.author.id !== user.id) {
      throw new ForbiddenException("You can't update nor delete someone else's tweet");
    }

    delete tweet.author.password;
    return tweet;
  }

  async delete(user: User, id: number): Promise<{ deleted: boolean }> {
    await this.findTweet(id, user);

    const res = await this.tweetsRepo.delete(id);

    return {
      deleted: res.affected > 0 ? true : false,
    };
  }

  async update(user: User, dto: TweetDto, id: number): Promise<Tweet> {
    const tweet = await this.findTweet(id, user);

    return this.tweetsRepo.save({
      ...tweet,
      content: dto.content,
    });
  }

  async create(user: User, dto: TweetDto): Promise<Tweet> {
    return this.tweetsRepo.save({
      author: user,
      content: dto.content,
      image: '',
    });
  }
}
