import { Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { DoctorPatientsAssignedTestsOrchestrator } from '../application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.asbtract';
import type { UUID } from 'node:crypto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller(`doctor/patients/:patientId/tests`)
@Roles([UserRole.ADMIN, UserRole.DOCTOR])
@ApiBearerAuth()
export class DoctorPatientsAssignedTestsController {
  constructor(
    private readonly orchestrator: DoctorPatientsAssignedTestsOrchestrator,
  ) {}

  @Get()
  async getAssignedTestsByPatientId(@Param('patientId') patientId: UUID) {
    return this.orchestrator.getAssignedTestsByPatientId(patientId);
  }

  @Post(':testId')
  async assignTestToPatient(
    @Param('testId') testId: UUID,
    @Param('patientId') patientId: UUID,
    @UserFromAuth() doctor: User,
  ) {
    return this.orchestrator.assignTestToPatient(testId, doctor.id, patientId);
  }

  @HttpCode(204)
  @Delete(':testId')
  async unassignTestFromPatient(
    @Param('testId') testId: UUID,
    @Param('patientId') patientId: UUID,
    @UserFromAuth() doctor: User,
  ) {
    return this.orchestrator.unassignTestFromPatient(
      testId,
      doctor.id,
      patientId,
    );
  }
}
