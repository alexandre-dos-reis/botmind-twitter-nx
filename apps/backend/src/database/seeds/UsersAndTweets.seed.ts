import { faker } from '@faker-js/faker';
import { Factory, Seeder } from 'typeorm-seeding';
import { Tweet } from '../../api/tweet/tweet.entity';
import { User } from '../../api/user/user.entity';

export default class UsersAndTweets implements Seeder {
  public async run(factory: Factory): Promise<any> {
    const users = await factory(User)().createMany(10);

    await factory(Tweet)()
      .map(async (tweet: Tweet) => {
        tweet.author = faker.helpers.arrayElement(users);
        return tweet;
      })
      .createMany(100);
  }
}
