import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationship, User } from '../entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Relationship) private relationshipRepo: Repository<Relationship>
  ) {}

  GetMyInfo(user: User) {
    if (!user) {
      throw new ForbiddenException();
    }

    const userWithInfo = this.userRepo.findOne({
      where: {
        id: user.id,
      },
      relations: ['followers', 'followeds', 'tweets'],
    });

    return userWithInfo;
  }

  async subscribe(currentUser: User, userIdToSubscribe: number) {
    if (!currentUser) {
      throw new ForbiddenException();
    }

    const relationship = await this.relationshipRepo.findOne({
      where: {
        follower: {
          id: currentUser.id,
        },
        followed: {
          id: userIdToSubscribe,
        },
      },
      relations: {
        followed: true,
        follower: true,
      },
    });

    let hasSubscribed: boolean;

    if (!relationship) {
      const relationship = this.relationshipRepo.create({
        follower: {
          id: currentUser.id,
        },
        followed: {
          id: userIdToSubscribe,
        },
      });

      this.relationshipRepo.save(relationship);

      hasSubscribed = true;
    } else {
      this.relationshipRepo.delete({
        id: relationship.id,
      });

      hasSubscribed = false;
    }

    return hasSubscribed;
  }
}
