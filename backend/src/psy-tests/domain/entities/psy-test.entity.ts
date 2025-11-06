import { UUID } from 'node:crypto';

export class PsyTest {
  id: UUID;
  name: string;
  type: string;
  description: string | null;
}

export class PsyTestWithDetails extends PsyTest {
  [key: string]: any;
}
