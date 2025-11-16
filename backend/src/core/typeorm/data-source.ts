import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
import {
  DATABASE_CONFIG_KEY,
  databaseConfig as getDatabaseConfig,
} from '../config/configs/database';

const dbConfig = getDatabaseConfig()[DATABASE_CONFIG_KEY];

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.name,
  entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  synchronize: false,
});
