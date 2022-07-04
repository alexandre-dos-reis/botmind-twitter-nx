import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User, Like, Relationship, Tweet } from '../../api/entities';
import * as argon from 'argon2';

export default class Main implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const numberOfUsers = 10;
    const numberOfTweets = 5 * numberOfUsers;
    const numberOfReplies = 5 * numberOfTweets
    const numberOfRelations = 10 * numberOfUsers;
    const numberOfPotentialsLikes = numberOfTweets * numberOfUsers;

    const users = await factory(User)()
      .map(async (user: User) => {
        user.password = await argon.hash('1234');
        return user;
      })
      .createMany(numberOfUsers);

    const tweets = await factory(Tweet)()
      .map(async (tweet: Tweet) => {
        tweet.author = faker.helpers.arrayElement(users);
        return tweet;
      })
      .createMany(numberOfTweets);

    const replies = await factory(Tweet)()
      .map(async (reply: Tweet) => {
        reply.author = faker.helpers.arrayElement(users);
        reply.parentTweet = faker.helpers.arrayElement(tweets)
        return reply
      })
      .createMany(numberOfReplies);

    for (let i = 0; i < numberOfRelations; i++) {
      const user1 = faker.helpers.arrayElement(users);
      const user2 = faker.helpers.arrayElement(users);
      if (user1.id !== user2.id) {
        await factory(Relationship)().create({
          followed: user1,
          follower: user2,
        });
      }
    }

    for (let i = 0; i < numberOfPotentialsLikes; i++) {
      const isLiked = faker.datatype.boolean();
      if (isLiked) {
        await factory(Like)().create({
          lover: faker.helpers.arrayElement(users),
          tweet: faker.helpers.arrayElement([...tweets, ...replies]),
        });
      }
    }
  }
}
