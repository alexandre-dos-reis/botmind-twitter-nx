import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Exclude, Transform } from 'class-transformer';

@Entity()
export class Tweet extends BaseEntity {
  @Column()
  content: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.tweets)
  author: User;

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => Like, (like) => like.tweet)
  likes: Like[];

  @Transform(({ obj }) => obj['likes'].length)
  likesCount = 0;

  isCurrentUserHasLiked = false;
}
