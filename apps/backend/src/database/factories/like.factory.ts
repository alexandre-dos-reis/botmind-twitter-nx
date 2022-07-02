import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Like } from '../../api/entities';

define(Like, () => {
  const l = new Like();
  l.createdAt = faker.date.past();
  l.updatedAt = faker.date.recent();
  return l;
});
