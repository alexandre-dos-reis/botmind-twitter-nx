import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private tweetsRepo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.tweetsRepo.find();
  }

  findOne(id: number): Promise<User> {
    return this.tweetsRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.tweetsRepo.delete(id);
  }
}
