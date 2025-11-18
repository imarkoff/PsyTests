import { Query } from '@nestjs/cqrs';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { UUID } from 'node:crypto';

export class GetAssignedTestByTestIdAndPatientIdQuery extends Query<AssignedTestDto | null> {
  constructor(
    public readonly testId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
