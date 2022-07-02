import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Relationship } from '../entities/relationship.entity';
import { User } from '../entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Relationship])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
