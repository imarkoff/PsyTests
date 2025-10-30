import { ApiSchema } from '@nestjs/swagger';

@ApiSchema({ description: 'Data Transfer Object for created session.' })
export class CreatedSessionDto {
  /**
   * The access token for the session.
   * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   */
  accessToken: string;

  /**
   * The expiration date and time of the access token.
   * @example 2024-12-31T23:59:59.000Z
   */
  accessTokenExpiresIn: Date;
}
