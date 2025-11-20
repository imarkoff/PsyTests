import { TestResultShortDto } from '../../presentation/dtos/test-result-short.dto';
import { randomUUID } from 'node:crypto';
import { createPsyTestDtoFixture } from '../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';

export const createTestResultShortDtoFixture = (
  overrides?: Partial<TestResultShortDto>,
) => {
  const persistence: TestResultShortDto = {
    id: randomUUID(),
    test: createPsyTestDtoFixture(),
    completedAt: new Date(),
    ...overrides,
  };

  const dto = new TestResultShortDto();
  Object.assign(dto, persistence);
  return dto;
};
