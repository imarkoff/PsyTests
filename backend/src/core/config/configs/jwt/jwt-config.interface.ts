export interface JwtConfig {
  secret: string;
  accessTokenExpiresInMinutes: number;
  refreshTokenExpiresInDays: number;
}
