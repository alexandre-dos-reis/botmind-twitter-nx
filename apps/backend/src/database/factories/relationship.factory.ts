import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Relationship } from '../../api/entities';

define(Relationship, () => {
  const r = new Relationship();
  r.createdAt = faker.date.past();
  return r;
});
