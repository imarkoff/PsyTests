import { parseProcessEnvInt } from '../../utils/parse-process-env-int.util';
import { DatabaseConfig } from './database-config.interface';
import { parseProcessEnv } from '../../utils/parse-process-env.util';

export const DATABASE_CONFIG_KEY = 'database';

export const databaseConfig = () => ({
  [DATABASE_CONFIG_KEY]: <DatabaseConfig>{
    host: parseProcessEnv('DB_HOST'),
    port: parseProcessEnvInt('DB_PORT'),
    username: parseProcessEnv('DB_USER'),
    password: parseProcessEnv('DB_PASSWORD'),
    name: parseProcessEnv('DB_NAME'),
    url: parseProcessEnv('DATABASE_URL'),
  },
});
