import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { User } from '../../api/entities/user.entity';

define(User, () => {
  const u = new User();
  u.email = faker.internet.email();
  u.password = '1234';
  u.createdAt = faker.date.past();
  u.updatedAt = faker.date.recent();
  return u;
});
