import { Controller, Get } from '@nestjs/common';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { User } from '../../users/domain/entities/user.entity';
import { PatientAssignedTestsOrchestrator } from '../application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.abstract';
import { ApiBearerAuth } from '@nestjs/swagger';

@Roles([UserRole.PATIENT])
@Controller('patient/tests/assigned')
@ApiBearerAuth()
export class PatientAssignedTestsController {
  constructor(
    private readonly orchestrator: PatientAssignedTestsOrchestrator,
  ) {}

  @Get()
  getAssignedTests(@UserFromAuth() patient: User) {
    return this.orchestrator.getAssignedTests(patient.id);
  }
}
