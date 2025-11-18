import { randomUUID } from 'node:crypto';
import { PsyTest } from '../../domain/entities/psy-test.entity';
import { PsyTestWithDetails } from '../../domain/entities/psy-test-with-details.entity';

export const createPsyTestFixture = (
  overrides?: Partial<PsyTestWithDetails>,
): PsyTest => ({
  id: randomUUID(),
  name: 'Sample Psy Test',
  description: 'This is a sample psychological test description.',
  type: 'sample-type',
  ...overrides,
});
