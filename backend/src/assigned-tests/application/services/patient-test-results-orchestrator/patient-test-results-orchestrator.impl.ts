import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { PatientTestResultsOrchestrator } from './patient-test-results-orchestrator.abstract';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { PassAssignedTestCommand } from '../../commands/pass-assigned-test/pass-assigned-test.command';
import { GetShortTestResultsByPatientIdQuery } from '../../queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.query';

@Injectable()
export class PatientTestResultsOrchestratorImpl
  implements PatientTestResultsOrchestrator
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  passAssignedTest(
    testId: UUID,
    patientId: UUID,
    answers: Record<string, any>,
  ): Promise<TestResultShortDto> {
    return this.commandBus.execute(
      new PassAssignedTestCommand(testId, patientId, answers),
    );
  }

  getPassedTests(patientId: UUID): Promise<TestResultShortDto[]> {
    return this.queryBus.execute(
      new GetShortTestResultsByPatientIdQuery(patientId),
    );
  }
}
