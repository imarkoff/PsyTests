import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { UUID } from 'node:crypto';

export abstract class PatientTestResultsOrchestrator {
  abstract passAssignedTest(
    testId: UUID,
    patientId: UUID,
    answers: Record<string, any>,
  ): Promise<TestResultShortDto>;

  abstract getPassedTests(patientId: UUID): Promise<TestResultShortDto[]>;
}
