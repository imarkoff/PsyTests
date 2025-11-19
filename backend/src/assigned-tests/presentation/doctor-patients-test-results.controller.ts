import { Controller, Get, Param } from '@nestjs/common';
import { DoctorPatientsTestResultsOrchestrator } from '../application/services/doctor-patients-test-results-orchestrator/doctor-patients-test-results-orchestrator.abstract';
import type { UUID } from 'node:crypto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';

@Controller('doctor/patients/:patientId/tests/results')
@Roles([UserRole.ADMIN, UserRole.DOCTOR])
@ApiBearerAuth()
export class DoctorPatientsTestResultsController {
  constructor(
    private readonly orchestrator: DoctorPatientsTestResultsOrchestrator,
  ) {}

  @Get()
  getPatientTestResults(@Param('patientId') patientId: UUID) {
    return this.orchestrator.getTestResultsByPatientId(patientId);
  }

  @Get(':testResultId')
  getTestResultById(
    @Param('patientId') _: UUID,
    @Param('testResultId') testResultId: UUID,
  ) {
    return this.orchestrator.getTestResultById(testResultId);
  }
}
