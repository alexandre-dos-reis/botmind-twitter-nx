import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Tweet } from '../../api/tweet/tweet.entity';

define(Tweet, () => {
  const t = new Tweet();
  t.content = faker.random.words(10)
  t.image = ""
  t.createdAt = faker.date.past();
  t.updatedAt = faker.date.recent();
  return t;
});
