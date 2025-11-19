import { UUID } from 'node:crypto';
import { TestResultDto } from '../../../presentation/dtos/test-result.dto';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';

export abstract class DoctorPatientsTestResultsOrchestrator {
  abstract getTestResultById(testResultId: UUID): Promise<TestResultDto>;

  abstract getTestResultsByPatientId(
    patientId: UUID,
  ): Promise<TestResultShortDto[]>;
}
