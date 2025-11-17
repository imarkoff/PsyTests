import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class AssignTestToPatientCommand extends Command<AssignedTestDto> {
  /**
   * Assigns a psychological test to a patient by a doctor.
   * @param testId - ID of the psychological test to be assigned
   * @param doctorId - ID of the doctor assigning the test
   * @param patientId - ID of the patient to whom the test is assigned
   * @returns AssignedTestDto representing the assigned test
   * @throws DoctorPatientNotFoundException if the doctor-patient relationship does not exist
   * @throws TestAlreadyAssignedException if the test is already assigned to the patient
   * @throws PsyTestNotFoundException if the test does not exist
   * @throws UserNotFoundException if the doctor or patient does not exist
   */
  constructor(
    public readonly testId: UUID,
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
