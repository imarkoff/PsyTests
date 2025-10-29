import { UUID } from 'node:crypto';

export interface TokenPayload {
  sub: UUID;
  role: string;
}
