import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { PsyTestsOrchestrator } from '../application/services/psy-tests-orchestrator/psy-tests-orchestrator.abstract';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';

@ApiTags('Psychological Tests')
@Controller('tests')
@ApiBearerAuth()
export class PsyTestsController {
  constructor(private readonly psyTestsOrchestrator: PsyTestsOrchestrator) {}

  @Roles([UserRole.PATIENT, UserRole.ADMIN])
  @Get()
  getTests() {
    return this.psyTestsOrchestrator.getTests();
  }

  @Get(':testId')
  getTestById(
    @Param('testId', new ParseUUIDPipe()) testId: UUID,
    @UserFromAuth() user: User | null,
  ) {
    return this.psyTestsOrchestrator.getTestById(testId, user);
  }

  // @Get(':testId/image')
  // getTestImage(@Param('testId', new ParseUUIDPipe()) testId: UUID) {
  //   return {};
  // }
  //
  // @Roles([UserRole.PATIENT, UserRole.ADMIN])
  // @Get(':testId/marks-system')
  // getTestMarks(@Param('testId', new ParseUUIDPipe()) testId: UUID) {
  //   return [];
  // }
}
