import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Tweet, User, Like } from '../entities';
import {
  HandleLikeResponse,
  TweetDtoQuery,
  TweetDtoRequest,
} from '@botmind-twitter-nx/api-interface';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet) private tweetsRepo: Repository<Tweet>,
    @InjectRepository(Like) private likesRepo: Repository<Like>
  ) {}

  async countAllTweets() {
    return await this.tweetsRepo.countBy({
      parentTweetId: IsNull(),
    });
  }

  async findByQuery(dto: TweetDtoQuery, currentUser?: User): Promise<Tweet[]> {
    const tweets = await this.tweetsRepo.find({
      where: {
        parentTweetId: IsNull(), // Select top level tweets
      },
      relations: {
        likes: {
          lover: true,
        },
        author: true,
        replies: {
          likes: {
            lover: true,
          },
          author: true,
        },
      },
      order: {
        createdAt: 'DESC',
        // This is causing a bug... Replies order will be handle by front app
        // replies: {
        //   createdAt: 'DESC',
        // },
      },
      take: dto.count,
      skip: dto.offset,
    });

    // Order by number of likes DESC
    // const sortedTweets = tweets.sort((a, b) => b.likes.length - a.likes.length);

    if (!currentUser) {
      return tweets;
    }

    // Checks to know is user liked Tweets and Replies...
    return tweets.map((tweet) => {
      const TweetLiked = tweet.likes.find((like) => like.lover.id === currentUser.id);
      if (TweetLiked) tweet.isCurrentUserHasLiked = true;
      tweet.replies.map((r) => {
        const replyLiked = r.likes.find((like) => like.lover.id === currentUser.id);
        if (replyLiked) r.isCurrentUserHasLiked = true;
        return r;
      });
      return tweet;
    });
  }

  private async findTweet(id: number, user: User): Promise<Tweet> {
    if (!user) {
      throw new ForbiddenException();
    }

    const tweet = await this.tweetsRepo.findOne({
      where: { id },
      relations: {
        author: true,
        replies: {
          author: true
        },
      },
    });

    if (!tweet) {
      throw new NotFoundException("Tweet doesn't exists !");
    }

    if (tweet.author.id !== user.id) {
      throw new ForbiddenException("You can't update nor delete someone else's tweet");
    }

    return tweet;
  }

  async delete(user: User, id: number): Promise<boolean> {
    if (!user) {
      throw new ForbiddenException();
    }

    const tweet = await this.findTweet(id, user);

    if (tweet.replies.length > 0) {
      this.tweetsRepo.delete(tweet.replies.map((r) => r.id));
    }

    const res = await this.tweetsRepo.delete(tweet.id);

    return res.affected > 0 ? true : false;
  }

  async update(user: User, dto: TweetDtoRequest, id: number): Promise<Tweet> {
    if (!user) {
      throw new ForbiddenException();
    }

    const tweet = await this.findTweet(id, user);

    return this.tweetsRepo.save({
      ...tweet,
      content: dto.content,
    });
  }

  async create(user: User, dto: TweetDtoRequest): Promise<Tweet> {
    if (!user) {
      throw new ForbiddenException();
    }

    return this.tweetsRepo.save({
      author: user,
      content: dto.content,
      image: '',
      repliesCount: 0,
      likesCount: 0,
      replies: [],
      likes: [],
    });
  }

  async like(user: User, tweetId: number): Promise<HandleLikeResponse> {
    if (!user) {
      throw new ForbiddenException();
    }

    const tweet = await this.tweetsRepo.findOne({
      where: {
        id: tweetId,
      },
      relations: {
        likes: {
          lover: true,
          tweet: true,
        },
      },
    });

    if (!tweet) throw new NotFoundException("Tweet doesn't exists !");

    const foundLike = tweet.likes.find((like) => like.lover.id === user.id);
    let isLiked: boolean;

    if (!foundLike) {
      const like = this.likesRepo.create({
        lover: {
          id: user.id,
        },
        tweet: { id: tweetId },
      });

      await this.likesRepo.save(like);

      isLiked = true;
    } else {
      await this.likesRepo.delete({
        id: foundLike.id,
      });
      isLiked = false;
    }

    return { isLiked };
  }

  async createReply(user: User, tweetId: number, dto: TweetDtoRequest): Promise<Tweet> {
    if (!user) {
      throw new ForbiddenException();
    }

    return this.tweetsRepo.save({
      author: user,
      content: dto.content,
      image: '',
      parentTweetId: tweetId,
      repliesCount: 0,
      likesCount: 0,
    });
  }
}
