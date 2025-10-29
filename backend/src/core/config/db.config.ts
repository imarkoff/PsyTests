import { parseEnvInt } from './env.util';

export default () => ({
  database: {
    host: process.env.DB_HOST,
    port: parseEnvInt('DB_PORT'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
    url: process.env.DATABASE_URL,
  },
});
