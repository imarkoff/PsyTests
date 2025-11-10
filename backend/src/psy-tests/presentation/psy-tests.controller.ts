import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { UUID } from 'node:crypto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { PsyTestsOrchestrator } from '../application/services/psy-tests-orchestrator/psy-tests-orchestrator.abstract';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import { type Response } from 'express';
import { lookup as mimeLookup } from 'mime-types';
import { MarksSystemDto } from './dtos/marks-system.dto';

@ApiTags('Psychological Tests')
@Controller('tests')
@ApiBearerAuth()
export class PsyTestsController {
  constructor(private readonly psyTestsOrchestrator: PsyTestsOrchestrator) {}

  /**
   * Get all psychological tests
   *
   * @remarks Gets a list of all available psychological tests. Not accessible by patients.
   *
   * @returns An array of psychological tests.
   * @throws {401} If the user is not authenticated.
   * @throws {403} If the user does not have the required role.
   */
  @Roles([UserRole.DOCTOR, UserRole.ADMIN])
  @Get()
  getTests() {
    return this.psyTestsOrchestrator.getTests();
  }

  /**
   * Get psychological test by ID
   *
   * @remarks
   *  Retrieves a psychological test by its unique identifier.
   *  Accessible by patients with limited details.
   *
   * @returns The psychological test corresponding to the provided ID.
   * @throws {401} If the user is not authenticated.
   * @throws {403} If the user does not have the required role.
   * @throws {404} If the test with the specified ID is not found.
   */
  @ApiParam({
    name: 'testId',
    format: 'uuid',
    description: 'The UUID of the psychological test.',
  })
  @Get(':testId')
  getTestById(
    @Param('testId', new ParseUUIDPipe()) testId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.psyTestsOrchestrator.getTestById(testId, user);
  }

  /**
   * Get image associated with a psychological test
   *
   * @remarks
   *  Retrieves an image file associated with a psychological test.
   *  Accessible by patients.
   *
   * @throws {401} If the user is not authenticated.
   * @throws {403} If the user does not have the required role.
   * @throws {404} If the test or image is not found.
   */
  @ApiParam({
    name: 'testId',
    format: 'uuid',
    description: 'The UUID of the psychological test.',
  })
  @ApiParam({
    name: 'imagePath',
    description:
      'The relative path to the image file inside the test resources.',
  })
  @ApiResponse({
    status: 200,
    description: 'The image file associated with the psychological test.',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
          example: 'binary',
        },
      },
    },
  })
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

  /**
   * Get marks system and additional info for a psychological test
   *
   * @remarks
   *  Retrieves the marks system and additional information for a specific psychological test.
   *  Accessible by doctors and admins.
   *
   * @returns The marks system and additional information for the specified test.
   * @throws {401} If the user is not authenticated.
   * @throws {403} If the user does not have the required role.
   * @throws {404} If the test with the specified ID is not found.
   */
  @ApiParam({
    name: 'testId',
    format: 'uuid',
    description: 'The UUID of the psychological test.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The marks system and additional information for the specified psychological test.',
    type: MarksSystemDto,
  })
  @Roles([UserRole.DOCTOR, UserRole.ADMIN])
  @Get(':testId/marks-system')
  getTestMarks(@Param('testId', new ParseUUIDPipe()) testId: UUID) {
    return this.psyTestsOrchestrator.getTestMarksSystem(testId);
  }
}
