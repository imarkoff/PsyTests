import { UUID } from 'crypto';
import { DoctorPatientsTestResultsOrchestrator } from './doctor-patients-test-results-orchestrator.abstract';
import { Injectable } from '@nestjs/common';
import { TestResultDto } from '../../../presentation/dtos/test-result.dto';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetTestResultByIdQuery } from '../../queries/get-test-result-by-id/get-test-result-by-id.query';
import { TestResultNotFoundException } from '../../../domain/exceptions/test-result-not-found.exception';
import { GetShortTestResultsByPatientIdQuery } from '../../queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.query';

@Injectable()
export class DoctorPatientsTestResultsOrchestratorImpl
  implements DoctorPatientsTestResultsOrchestrator
{
  constructor(private readonly queryBus: QueryBus) {}

  async getTestResultById(testResultId: UUID): Promise<TestResultDto> {
    const testResult = await this.queryBus.execute(
      new GetTestResultByIdQuery(testResultId),
    );
    if (!testResult) {
      throw new TestResultNotFoundException(testResultId);
    }
    return testResult;
  }

  getTestResultsByPatientId(patientId: UUID): Promise<TestResultShortDto[]> {
    return this.queryBus.execute(
      new GetShortTestResultsByPatientIdQuery(patientId),
    );
  }
}
