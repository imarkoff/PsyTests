import { UUID } from 'node:crypto';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { DoctorPatientsAssignedTestsOrchestrator } from './doctor-patients-assigned-tests-orchestrator.asbtract';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetAssignedTestsByPatientIdQuery } from '../../queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.query';
import { AssignTestToPatientCommand } from '../../commands/assign-test-to-patient/assign-test-to-patient.command';
import { UnassignTestCommand } from '../../commands/unassign-test/unassign-test.command';

@Injectable()
export class DoctorPatientsAssignedTestsOrchestratorImpl
  implements DoctorPatientsAssignedTestsOrchestrator
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  getAssignedTestsByPatientId(patientId: UUID): Promise<AssignedTestDto[]> {
    return this.queryBus.execute(
      new GetAssignedTestsByPatientIdQuery(patientId),
    );
  }

  assignTestToPatient(
    testId: UUID,
    doctorId: UUID,
    patientId: UUID,
  ): Promise<AssignedTestDto> {
    return this.commandBus.execute(
      new AssignTestToPatientCommand(testId, doctorId, patientId),
    );
  }

  unassignTestFromPatient(
    testId: UUID,
    doctorId: UUID,
    patientId: UUID,
  ): Promise<void> {
    return this.commandBus.execute(
      new UnassignTestCommand(testId, doctorId, patientId),
    );
  }
}
