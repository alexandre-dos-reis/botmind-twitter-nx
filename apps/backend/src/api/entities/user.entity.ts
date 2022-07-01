import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Tweet } from './tweet.entity';
import { BaseEntity } from '../shared/base.entity';
import { Relationship } from './relationship.entity';

@Entity()
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Tweet, (tweet) => tweet.author)
  tweets: Tweet[];

  @OneToMany(() => Relationship, (relationship) => relationship.follower)
  followers: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.followed)
  followeds: Relationship[];
}
