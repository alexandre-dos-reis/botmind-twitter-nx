import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tweet } from '../../api/entities/tweet.entity';
import { Relationship } from '../../api/entities/relationship.entity';
import { User } from '../../api/entities/user.entity';

export const databaseConfig = () =>
  ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Tweet, Relationship],
    synchronize: true, // DO NOT USE IN PRODUCTION
  } as TypeOrmModuleOptions);
