export interface CreatedSession {
  accessToken: string;
  accessTokenExpiresIn: Date;
  refreshToken: string;
  refreshTokenExpiresIn: Date;
}
