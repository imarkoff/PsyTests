import { Injectable } from '@nestjs/common';
import { PatientAssignedTestsOrchestrator } from './patient-assigned-tests-orchestrator.abstract';
import { UUID } from 'node:crypto';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetAssignedTestsByPatientIdQuery } from '../../queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.query';

@Injectable()
export class PatientAssignedTestsOrchestratorImpl
  implements PatientAssignedTestsOrchestrator
{
  constructor(private readonly queryBus: QueryBus) {}

  getAssignedTests(patientId: UUID): Promise<AssignedTestDto[]> {
    return this.queryBus.execute(
      new GetAssignedTestsByPatientIdQuery(patientId),
    );
  }
}
