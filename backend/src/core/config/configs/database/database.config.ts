import { parseEnvInt } from '../../utils/env.util';
import { DatabaseConfig } from './database-config.interface';

export const DATABASE_CONFIG_KEY = 'database';

export const databaseConfig = () => ({
  [DATABASE_CONFIG_KEY]: <DatabaseConfig>{
    host: process.env.DB_HOST,
    port: parseEnvInt('DB_PORT'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
  },
});
