import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { User } from './user.entity';

@Entity()
export class Tweet extends BaseEntity {
  @Column()
  content: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.tweets)
  author: User;
}
