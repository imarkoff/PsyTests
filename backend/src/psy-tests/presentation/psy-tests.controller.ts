import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { PsyTestsOrchestrator } from '../application/services/psy-tests-orchestrator/psy-tests-orchestrator.abstract';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import { type Response } from 'express';
import { lookup as mimeLookup } from 'mime-types';

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

  @Get(':testId/image')
  async getTestImage(
    @Param('testId', new ParseUUIDPipe()) testId: UUID,
    @Query('imagePath') imagePath: string,
    @Res() res: Response,
  ) {
    const buffer = await this.psyTestsOrchestrator.getTestImage(
      testId,
      imagePath,
    );
    const contentType = mimeLookup(imagePath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length.toString());
    res.send(buffer);
  }

  @Roles([UserRole.PATIENT, UserRole.ADMIN])
  @Get(':testId/marks-system')
  getTestMarks(@Param('testId', new ParseUUIDPipe()) testId: UUID) {
    return this.psyTestsOrchestrator.getTestMarksSystem(testId);
  }
}
