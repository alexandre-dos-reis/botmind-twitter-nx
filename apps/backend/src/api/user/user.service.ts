import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  GetMyInfo(user: User) {
    const userWithInfo = this.userRepo.findOne({
      where: {
        id: user.id,
      },
      relations: ['followers', 'followeds', 'tweets'],
    });

    return userWithInfo;
  }
}
