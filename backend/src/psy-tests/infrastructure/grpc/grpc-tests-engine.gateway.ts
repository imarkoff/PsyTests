import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PsyTestsEngineGateway } from '../../domain/interfaces/psy-tests-engine.gateway';
import { TestsEngineClient } from '../../domain/interfaces/tests-engine.client';
import {
  TESTS_ENGINE_NAME,
  TESTS_PACKAGE_NAME,
} from '../../domain/constants/tests-package.constant';
import { type ClientGrpc } from '@nestjs/microservices';
import { UUID } from 'node:crypto';
import { status } from '@grpc/grpc-js';
import { GrpcFetcher } from '../../../shared/grpc/application/grpc-fetcher/grpc-fetcher.abstract';
import { PsyTest } from '../../domain/entities/psy-test.entity';
import { PsyTestWithDetails } from '../../domain/entities/psy-test-with-details.entity';

@Injectable()
export class GrpcTestsEngineGateway
  implements PsyTestsEngineGateway, OnModuleInit
{
  private readonly logger = new Logger(GrpcTestsEngineGateway.name);
  private testsClient: TestsEngineClient;

  constructor(
    @Inject(TESTS_PACKAGE_NAME) private readonly client: ClientGrpc,
    private readonly grpcFetcher: GrpcFetcher,
  ) {}

  onModuleInit() {
    this.testsClient =
      this.client.getService<TestsEngineClient>(TESTS_ENGINE_NAME);
  }

  async getAllTests(): Promise<PsyTest[]> {
    this.logger.debug('Getting all psychological tests from Tests Engine...');

    const observable = this.testsClient.getAllTests({});

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => {
        this.logger.debug(
          'Retrieved all psychological tests from Tests Engine.',
        );
        return response.tests;
      },
    });
  }

  async getTestById(id: UUID): Promise<PsyTestWithDetails | null> {
    this.logger.debug(
      `Getting psychological test by ID ${id} from Tests Engine...`,
    );

    return this.grpcFetcher.fetch({
      request: this.testsClient.getTestById({ testId: id }),
      onSuccess: (response) => {
        this.logger.debug(`Retrieved test with ID ${id} from Tests Engine.`);
        return this.parseTestJson(id, response.json);
      },
      onFailure: {
        [status.NOT_FOUND]: () => {
          this.logger.debug(`Test with ID ${id} not found in Tests Engine.`);
          return null;
        },
      },
    });
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
    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => {
        this.logger.debug(
          `Retrieved test with ID ${id} without answers from Tests Engine.`,
        );
        return this.parseTestJson(id, response.json);
      },
      onFailure: {
        [status.NOT_FOUND]: () => {
          this.logger.debug(`Test with ID ${id} not found in Tests Engine.`);
          return null;
        },
      },
    });
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

  async getTestMetadataById(id: UUID): Promise<PsyTest | null> {
    this.logger.debug(
      `Getting metadata for psychological test by ID ${id} from Tests Engine...`,
    );

    const observable = this.testsClient.getTestMetadataById({ testId: id });

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => {
        this.logger.debug(
          `Retrieved metadata for test with ID ${id} from Tests Engine.`,
        );
        return response;
      },
      onFailure: {
        [status.NOT_FOUND]: () => {
          this.logger.debug(
            `Metadata for test with ID ${id} not found in Tests Engine.`,
          );
          return null;
        },
      },
    });
  }

  async getTestImage(id: UUID, imagePath: string): Promise<Buffer | null> {
    this.logger.debug(
      `Getting image for psychological test by ID ${id} from Tests Engine...`,
    );
    const observable = this.testsClient.getTestImage({
      testId: id,
      imagePath: imagePath,
    });

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => {
        this.logger.debug(
          `Retrieved image for test with ID ${id} from Tests Engine.`,
        );
        return response.imageData;
      },
      onFailure: {
        [status.NOT_FOUND]: () => {
          this.logger.debug(
            `Image for test with ID ${id} not found in Tests Engine.`,
          );
          return null;
        },
      },
    });
  }

  async getTestMarksSystem(id: UUID): Promise<object | [] | null> {
    this.logger.debug(
      `Getting marks system for psychological test by ID ${id} from Tests Engine...`,
    );
    const observable = this.testsClient.getTestMarksSystem({ testId: id });

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => {
        if (!response.marksSystemJson) {
          this.logger.debug(
            `Marks system for test with ID ${id} not found in Tests Engine.`,
          );
          return null;
        }

        this.logger.debug(
          `Retrieved marks system for test with ID ${id} from Tests Engine.`,
        );
        return JSON.parse(response.marksSystemJson) as object | [];
      },
      onFailure: {
        [status.NOT_FOUND]: () => {
          this.logger.debug(
            `Marks system for test with ID ${id} not found in Tests Engine.`,
          );
          return null;
        },
      },
    });
  }
}
