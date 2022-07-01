import { define } from 'typeorm-seeding';
import { faker } from '@faker-js/faker';
import { Relationship } from '../../api/entities/relationship.entity';

define(Relationship, () => {
  const r = new Relationship();
  r.createdAt = faker.date.past();
  r.updatedAt = faker.date.recent();
  return r;
});
