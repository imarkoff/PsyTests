import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import { UserRole } from '../../shared/enums/user-role.enum';
import { Roles } from '../../core/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PatientTestResultsOrchestrator } from '../application/services/patient-test-results-orchestrator/patient-test-results-orchestrator.abstract';

@Controller('patient/tests/results')
@Roles([UserRole.PATIENT])
@ApiBearerAuth()
export class PatientTestResultsController {
  constructor(private readonly orchestrator: PatientTestResultsOrchestrator) {}

  @ApiBody({
    description: 'Answers to the assigned test questions',
    schema: {
      type: 'object',
      additionalProperties: {
        type: 'string',
      },
    },
  })
  @Post(':testId')
  passAssignedTest(
    @Param('testId') testId: UUID,
    @Body() answers: Record<string, any>,
    @UserFromAuth() patient: User,
  ) {
    return this.orchestrator.passAssignedTest(testId, patient.id, answers);
  }

  @Get()
  getPassedTests(@UserFromAuth() patient: User) {
    return this.orchestrator.getPassedTests(patient.id);
  }
}
