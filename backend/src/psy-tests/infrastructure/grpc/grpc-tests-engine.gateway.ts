import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PsyTestsEngineGateway } from '../../domain/interfaces/psy-tests-engine.gateway';
import {
  PsyTest,
  PsyTestWithDetails,
} from 'src/psy-tests/domain/entities/psy-test.entity';
import { TestsEngineClient } from '../../domain/interfaces/tests-engine.client';
import {
  TESTS_ENGINE_NAME,
  TESTS_PACKAGE_NAME,
} from '../../domain/constants/tests-package.constant';
import { type ClientGrpc } from '@nestjs/microservices';
import { UUID } from 'node:crypto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GrpcTestsEngineGateway
  implements PsyTestsEngineGateway, OnModuleInit
{
  private readonly logger = new Logger(GrpcTestsEngineGateway.name);
  private testsClient: TestsEngineClient;

  constructor(
    @Inject(TESTS_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.testsClient =
      this.client.getService<TestsEngineClient>(TESTS_ENGINE_NAME);
  }

  async getAllTests(): Promise<PsyTest[]> {
    this.logger.debug('Getting all psychological tests from Tests Engine...');

    const observable = this.testsClient.getAllTests({});
    const response = await firstValueFrom(observable);

    this.logger.debug(
      `Retrieved ${response.tests.length} tests from Tests Engine.`,
    );

    return response.tests;
  }
  async getTestById(id: UUID): Promise<PsyTestWithDetails | null> {
    this.logger.debug(
      `Getting psychological test by ID ${id} from Tests Engine...`,
    );

    const observable = this.testsClient.getTestById({ testId: id });
    const response = await firstValueFrom(observable);
    return this.parseTestJson(id, response.json);
  }

  async getTestByIdWithoutAnswers(
    id: UUID,
  ): Promise<PsyTestWithDetails | null> {
    this.logger.debug(
      `Getting psychological test by ID ${id} without answers from Tests Engine...`,
    );

    const observable = this.testsClient.getTestByIdWithoutAnswers({
      testId: id,
    });
    const response = await firstValueFrom(observable);

    return this.parseTestJson(id, response.json);
  }

  private parseTestJson(
    testId: UUID,
    json: string | undefined,
  ): PsyTestWithDetails | null {
    if (!json) {
      this.logger.debug(`Test with ID ${testId} not found in Tests Engine.`);
      return null;
    }

    this.logger.debug(`Retrieved test with ID ${testId} from Tests Engine.`);
    return JSON.parse(json) as PsyTestWithDetails;
  }
}
