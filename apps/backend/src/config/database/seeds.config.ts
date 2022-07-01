import { ConnectionOptions } from "typeorm-seeding";
import { databaseConfig } from "./database.config";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();

export default {
  ...databaseConfig(),
  seeds: ["apps/backend/src/database/seeds/**/*{.ts,.js}"],
  factories: ["apps/backend/src/database/factories/**/*{.ts,.js}"],
} as ConnectionOptions;