import { AssignedTestDto } from '../../presentation/dtos/assigned-test.dto';
import { randomUUID } from 'node:crypto';
import { createPsyTestDtoFixture } from '../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';

export const createAssignedTestDtoFixture = (
  overrides?: Partial<AssignedTestDto>,
) => {
  const persistence: AssignedTestDto = {
    id: randomUUID(),
    test: createPsyTestDtoFixture(),
    assignedByDoctorId: randomUUID(),
    assignedToPatientId: randomUUID(),
    assignedAt: new Date(),
    assignedByDoctor: null,
    assignedToPatient: null,
    unassignedAt: null,
    ...overrides,
  };

  const dto = new AssignedTestDto();
  Object.assign(dto, persistence);
  return dto;
};
