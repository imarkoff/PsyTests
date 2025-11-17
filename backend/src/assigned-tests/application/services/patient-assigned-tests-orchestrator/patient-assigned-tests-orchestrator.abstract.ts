import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { UUID } from 'node:crypto';

export abstract class PatientAssignedTestsOrchestrator {
  /**
   * Get assigned tests for a patient
   * @param patientId - The ID of the patient
   * @returns A promise that resolves to an array of AssignedTestDto
   */
  abstract getAssignedTests(patientId: UUID): Promise<AssignedTestDto[]>;
}
