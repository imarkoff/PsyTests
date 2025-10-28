import { parseEnvInt } from './env.util';

export default () => ({
  port: parseEnvInt('PORT'),
  environment: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || '1',
});
