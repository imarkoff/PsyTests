import { parseProcessEnvInt } from '../../utils/parse-process-env-int.util';
import { AppConfig } from './app-config.interface';
import { parseProcessEnv } from '../../utils/parse-process-env.util';

export const APP_CONFIG_KEY = 'app';

export const appConfig = () => ({
  app: <AppConfig>{
    port: parseProcessEnvInt('PORT'),
    environment: parseProcessEnv('NODE_ENV', 'development'),
    apiVersion: parseProcessEnv('API_VERSION', '1'),
  },
});
