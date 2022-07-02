import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';

@Entity()
export class Like extends BaseEntity {
  @ManyToOne(() => User, (user) => user.followers)
  lover: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.likes)
  tweet: Tweet;
}
