import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';
import { QueryFailedError, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

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

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    return await this.signToken(user);
  }

  async signToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '10m', // 10 minutes before expiration
      secret,
    });

    return {
      access_token: token,
    };
  }
}
