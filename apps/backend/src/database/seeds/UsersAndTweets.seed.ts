import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../api/entities/user.entity';
import { Tweet } from '../../api/entities/tweet.entity';
import { Relationship } from '../../api/entities/relationship.entity';
import * as argon from 'argon2';

export default class UsersAndTweets implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const numberOfUsers = 10;
    const numberOfTweets = 10 * numberOfUsers;
    const numberOfRelations = 10 * numberOfUsers;

    const users = await factory(User)()
      .map(async (user: User) => {
        user.password = await argon.hash('1234');
        return user;
      })
      .createMany(numberOfUsers);

    await factory(Tweet)()
      .map(async (tweet: Tweet) => {
        tweet.author = faker.helpers.arrayElement(users);
        return tweet;
      })
      .createMany(numberOfTweets);

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
  }
}
