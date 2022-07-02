import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from '../entities/tweet.entity';

@Injectable()
export class TweetService {
  constructor(@InjectRepository(Tweet) private tweetsRepo: Repository<Tweet>) {}

  async find(): Promise<Tweet[]> {
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

  findOne(id: number): Promise<Tweet> {
    return this.tweetsRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.tweetsRepo.delete(id);
  }
}
