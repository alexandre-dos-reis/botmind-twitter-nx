import { Module } from '@nestjs/common';
import * as Nest from '@nestjs/config';
import { databaseConfig } from './database/database.config';

@Module({
  imports: [
    Nest.ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      cache: true,
      load: [() => ({ database: databaseConfig() })],
    }),
  ],
})
export class ConfigModule {}
