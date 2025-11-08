import { PsyTestDto } from '../../presentation/dtos/psy-test.dto';
import { randomUUID } from 'node:crypto';

export const createPsyTestDtoFixture = (
  overrides?: Partial<PsyTestDto>,
): PsyTestDto => ({
  id: randomUUID(),
  name: 'Sample Psy Test',
  description: 'This is a sample psychological test description.',
  type: 'sample-type',
  ...overrides,
});
