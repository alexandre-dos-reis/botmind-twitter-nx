import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';

@Injectable()
export class TweetService {
  constructor(@InjectRepository(Tweet) private tweetsRepo: Repository<Tweet>) {}

  findAll(): Promise<Tweet[]> {
    return this.tweetsRepo.find({
      relations: ['author']
    });
  }

  findOne(id: number): Promise<Tweet> {
    return this.tweetsRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<void> { 
    await this.tweetsRepo.delete(id);
  }
}
