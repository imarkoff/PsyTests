import { parseProcessEnvInt } from '../../utils/parse-process-env-int.util';
import { JwtConfig } from './jwt-config.interface';
import { parseProcessEnv } from '../../utils/parse-process-env.util';

export const JWT_CONFIG_KEY = 'jwt';

export const jwtConfig = () => ({
  jwt: <JwtConfig>{
    secret: parseProcessEnv('JWT_SECRET'),
    accessTokenExpiresInMinutes: parseProcessEnvInt(
      'JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES',
    ),
    refreshTokenExpiresInDays: parseProcessEnvInt(
      'JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS',
    ),
  },
});
