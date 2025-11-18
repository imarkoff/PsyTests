import { TestResult } from '../entities/test-result.entity';
import { UUID } from 'node:crypto';

export abstract class TestResultsRepository {
  abstract getByPatientIdDesc(patientId: UUID): Promise<TestResult[]>;

  abstract getById(testResultId: UUID): Promise<TestResult | null>;

  abstract create(testResult: TestResult): Promise<TestResult>;

  abstract update(testResult: TestResult): Promise<TestResult>;
}
