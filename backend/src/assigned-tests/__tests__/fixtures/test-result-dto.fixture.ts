import { TestResultDto } from '../../presentation/dtos/test-result.dto';
import { randomUUID } from 'node:crypto';
import { createPsyTestDtoFixture } from '../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';

export const createTestResultDtoFixture = (
  overrides?: Partial<TestResultDto>,
): TestResultDto => {
  const persistence: TestResultDto = {
    id: randomUUID(),
    test: createPsyTestDtoFixture(),
    completedByPatientId: randomUUID(),
    resultsData: {
      question1: 'Sample answer 1',
      question2: 'Sample answer 2',
    },
    completedAt: new Date(),
    ...overrides,
  };

  const dto = new TestResultDto();
  Object.assign(dto, persistence);
  return dto;
};
