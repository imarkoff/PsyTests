import { parseEnvInt } from '../../utils/env.util';
import { AppConfig } from './app-config.interface';

export const APP_CONFIG_KEY = 'app';

export const appConfig = () => ({
  app: <AppConfig>{
    port: parseEnvInt('PORT'),
    environment: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || '1',
  },
});
