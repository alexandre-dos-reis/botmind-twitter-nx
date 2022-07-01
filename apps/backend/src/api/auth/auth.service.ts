import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async signUp(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = this.userRepo.create({
        email: dto.email,
        password: hash,
      });

      await this.userRepo.save(user);

      delete user.password;

      return user;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ForbiddenException('Credentials taken');
      }
    }
  }

  async signIn(dto: AuthDto) {
    // find the user by email
    const user = await this.userRepo.findOneBy({
      email: dto.email,
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);

    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // Send back user minus password
    delete user.password;
    return user;
  }
}
