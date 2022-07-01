import { Entity, Column, OneToMany } from 'typeorm';
import { Tweet } from '../tweet/tweet.entity';
import { BaseEntity } from '../shared/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Tweet, (tweet) => tweet.author)
  tweets: Tweet[];
}
