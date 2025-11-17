import { UUID } from 'node:crypto';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';

export abstract class DoctorPatientsAssignedTestsOrchestrator {
  /**
   * Get assigned tests by patient ID
   * @param patientId - Patient ID to get assigned tests for
   * @returns List of assigned tests for the patient
   */
  abstract getAssignedTestsByPatientId(
    patientId: UUID,
  ): Promise<AssignedTestDto[]>;

  /**
   * Assign test to patient
   * @param testId - Test ID to assign to the patient
   * @param doctorId - Doctor ID who is assigning the test
   * @param patientId - Patient ID to whom the test is being assigned
   * @returns The assigned test DTO
   */
  abstract assignTestToPatient(
    testId: UUID,
    doctorId: UUID,
    patientId: UUID,
  ): Promise<AssignedTestDto>;

  /**
   * Unassign test from patient
   * @param testId - Test ID to unassign from the patient
   * @param doctorId - Doctor ID who is unassigning the test
   * @param patientId - Patient ID from whom the test is being unassigned
   */
  abstract unassignTestFromPatient(
    testId: UUID,
    doctorId: UUID,
    patientId: UUID,
  ): Promise<void>;
}
