import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

export const connectionSource = new DataSource({
  ...(databaseConfig() as DataSourceOptions),
  migrations: ['apps/backend/src/database/migrations/**/*{.ts,.js}'],
});

connectionSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
