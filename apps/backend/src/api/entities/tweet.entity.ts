import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Like } from './like.entity';

@Entity()
export class Tweet extends BaseEntity {
  @Column()
  content: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.tweets)
  author: User;

  @OneToMany(() => Like, (like) => like.tweet)
  likes: Like[];
}
