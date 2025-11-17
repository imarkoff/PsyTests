import { Query } from '@nestjs/cqrs';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { UUID } from 'node:crypto';

export class GetAssignedTestsByPatientIdQuery extends Query<AssignedTestDto[]> {
  constructor(public readonly patientId: UUID) {
    super();
  }
}
