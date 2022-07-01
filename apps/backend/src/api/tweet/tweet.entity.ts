import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../shared/base.entity';

@Entity()
export class Tweet extends BaseEntity {
  @Column()
  content: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.tweets)
  author: User;
}
