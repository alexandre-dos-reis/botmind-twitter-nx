import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { User } from '../../api/entities';

define(User, () => {
  const u = new User();
  u.firstname = faker.name.firstName();
  u.lastname = faker.name.lastName();
  u.email = faker.internet.email(u.firstname, u.lastname);
  u.password = '1234';
  u.createdAt = faker.date.past();
  u.updatedAt = faker.date.recent();
  return u;
});
