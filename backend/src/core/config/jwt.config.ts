import { parseEnvInt } from './env.util';

export interface JwtConfig {
  secret: string;
  accessTokenExpiresInMinutes: number;
  refreshTokenExpiresInDays: number;
}

export default (): JwtConfig => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');

  return {
    secret,
    accessTokenExpiresInMinutes: parseEnvInt(
      'JWT_ACCESS_TOKEN_EXPIRES_IN_MINUTES',
    ),
    refreshTokenExpiresInDays: parseEnvInt('JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS'),
  };
};
