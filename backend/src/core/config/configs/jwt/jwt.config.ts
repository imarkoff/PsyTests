import { parseEnvInt } from '../../utils/env.util';
import { JwtConfig } from './jwt-config.interface';

export const JWT_CONFIG_KEY = 'jwt';

export const jwtConfig = (): { jwt: JwtConfig } => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');

  return {
    jwt: {
      secret,
      accessTokenExpiresInMinutes: parseEnvInt(
        'JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES',
      ),
      refreshTokenExpiresInDays: parseEnvInt(
        'JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS',
      ),
    },
  };
};
