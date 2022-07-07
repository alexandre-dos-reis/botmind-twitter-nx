import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.followers)
  lover: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.likes, {onDelete: 'CASCADE'})
  tweet: Tweet;
}
