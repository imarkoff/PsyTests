import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { PsyTestsOrchestrator } from './psy-tests-orchestrator.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetPsyTestsQuery } from '../../queries/get-psy-tests/get-psy-tests.query';
import { UUID } from 'crypto';
import { User } from 'src/users/domain/entities/user.entity';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { GetPsyTestByIdQuery } from '../../queries/get-psy-test-by-id/get-psy-test-by-id.query';
import { GetPsyTestByIdWithoutAnswersQuery } from '../../queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.query';
import { PsyTestNotFoundException } from '../../../domain/exceptions/psy-test-not-found.exception';
import { GetPsyTestImageQuery } from '../../queries/get-psy-test-image/get-psy-test-image.query';
import { PsyTestImageNotFoundException } from '../../../domain/exceptions/psy-test-image-not-found.exception';
import { GetPsyTestMarksSystemQuery } from '../../queries/get-psy-test-marks-system/get-psy-test-marks-system.query';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

@Injectable()
export class PsyTestsOrchestratorImpl implements PsyTestsOrchestrator {
  private readonly logger = new Logger(PsyTestsOrchestratorImpl.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly roleValidator: RoleValidator,
  ) {}

  getTests(): Promise<PsyTestDto[]> {
    return this.queryBus.execute(new GetPsyTestsQuery());
  }

  async getTestById(
    testId: UUID,
    requestedBy: User,
  ): Promise<PsyTestWithDetailsDto> {
    let test;

    if (this.roleValidator.isDoctorOrAdmin(requestedBy.role)) {
      this.logger.debug(
        `User ${requestedBy.id} is a doctor or admin, fetching full test details.`,
      );
      test = await this.queryBus.execute(new GetPsyTestByIdQuery(testId));
    } else {
      this.logger.debug(
        `User ${requestedBy.id} is not a doctor or admin, fetching test without answers.`,
      );
      test = await this.queryBus.execute(
        new GetPsyTestByIdWithoutAnswersQuery(testId),
      );
    }

    if (!test) throw new PsyTestNotFoundException(testId);
    return test;
  }

  async getTestImage(testId: UUID, imagePath: string): Promise<Buffer> {
    const buffer = await this.queryBus.execute(
      new GetPsyTestImageQuery(testId, imagePath),
    );

    if (!buffer) {
      throw new PsyTestImageNotFoundException(testId, imagePath);
    }

    return buffer;
  }

  async getTestMarksSystem(testId: UUID): Promise<object | [] | null> {
    const marksSystem = await this.queryBus.execute(
      new GetPsyTestMarksSystemQuery(testId),
    );

    if (!marksSystem) {
      throw new PsyTestNotFoundException(testId);
    }

    return marksSystem;
  }
}
