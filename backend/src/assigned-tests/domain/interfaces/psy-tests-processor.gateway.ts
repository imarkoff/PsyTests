import {
  GeneratedDocument,
  TestVerdict,
} from '../types/psy-tests-processor.types';
import { User } from '../../../users/domain/entities/user.entity';
import { TestAnswers } from '../types/test-answers.type';
import { TestResult } from '../entities/test-result.entity';
import { UUID } from 'node:crypto';

export abstract class PsyTestsProcessorGateway {
  /**
   * Calculate test verdict based on user's answers
   * @param testId - ID of the test
   * @param patient - patient information for whom the test was taken
   * @param answers - answers provided by the patient
   * @returns TestVerdict or null if calculation failed
   */
  abstract calculateVerdict(
    testId: UUID,
    patient: User,
    answers: TestAnswers,
  ): Promise<TestVerdict | null>;

  /**
   * Generate document based on test result
   * @param testResult - test result entity. Should include user relation
   * @returns GeneratedDocument or null if generation failed
   */
  abstract generateDocument(
    testResult: TestResult,
  ): Promise<GeneratedDocument | null>;
}
