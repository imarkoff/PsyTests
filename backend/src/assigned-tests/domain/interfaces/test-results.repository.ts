import { TestResult } from '../entities/test-result.entity';
import { UUID } from 'node:crypto';

export abstract class TestResultsRepository {
  /**
   * Get test results by patient ID in descending order of completion date.
   * @param patientId - The UUID of the patient.
   * @returns A promise that resolves to an array of TestResult entities.
   */
  abstract getByPatientIdDesc(patientId: UUID): Promise<TestResult[]>;

  /**
   * Get a test result by its ID.
   * @param testResultId - The UUID of the test result.
   * @returns A promise that resolves to the TestResult entity or null if not found.
   */
  abstract getById(testResultId: UUID): Promise<TestResult | null>;

  /**
   * Create a new test result.
   * @param testResult - The TestResult entity to create.
   * @returns A promise that resolves to the created TestResult entity.
   */
  abstract create(testResult: TestResult): Promise<TestResult>;

  /**
   * Update an existing test result.
   * @param testResult - The TestResult entity to update.
   * @returns A promise that resolves to the updated TestResult entity.
   */
  abstract update(testResult: TestResult): Promise<TestResult>;
}
