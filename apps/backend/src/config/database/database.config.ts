import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tweet } from '../../api/tweet/tweet.entity';
import { User } from '../../api/user/user.entity';

export const databaseConfig = () =>
  ({
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Tweet],
    synchronize: true, // DO NOT USE IN PRODUCTION
  } as TypeOrmModuleOptions);
