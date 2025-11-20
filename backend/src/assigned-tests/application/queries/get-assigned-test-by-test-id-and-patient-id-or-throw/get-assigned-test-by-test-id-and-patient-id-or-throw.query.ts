import { Query } from '@nestjs/cqrs';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { UUID } from 'node:crypto';

export class GetAssignedTestByTestIdAndPatientIdOrThrowQuery extends Query<AssignedTestDto> {
  /**
   * Gets assigned test by test id and patient id or throws exception if not found
   * @param testId - ID of the psychological test
   * @param patientId - ID of the patient
   * @throws AssignedTestByTestIdAndPatientIdNotFoundException if no assigned test is found
   * @throws PsyTestNotFoundException if no psychological test metadata is found
   */
  constructor(
    public readonly testId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
