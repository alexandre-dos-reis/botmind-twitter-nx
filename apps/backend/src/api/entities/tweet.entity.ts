import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.tweets, {onDelete: 'CASCADE'})
  author: User;

  @Exclude({ toPlainOnly: true })
  @OneToMany(() => Like, (like) => like.tweet, {onDelete: 'CASCADE'})
  likes: Like[];

  @Transform(({ obj }) => obj['likes'] && obj['likes'].length)
  likesCount = 0;

  isCurrentUserHasLiked = false;

  // Self entity relations : Tweets and relation
  @Column({ nullable: true })
  parentTweetId: number;

  @OneToMany(() => Tweet, (tweet) => tweet.parentTweet, {onDelete: 'CASCADE'})
  replies: Tweet[];

  @ManyToOne(() => Tweet, (tweet) => tweet.replies)
  @JoinColumn({ name: 'parentTweetId' })
  parentTweet: Tweet;

  @Transform(({ obj }) => obj['replies'] && obj['replies'].length)
  repliesCount = 0;
}
