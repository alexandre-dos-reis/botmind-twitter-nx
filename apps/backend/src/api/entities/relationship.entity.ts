import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { User } from './user.entity';

@Entity()
export class Relationship extends BaseEntity {
  @ManyToOne(() => User, (user) => user.followers, {})
  follower: User;

  @ManyToOne(() => User, (user) => user.followeds)
  followed: User;
}
