import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PsyTestsProcessorGateway } from '../../domain/interfaces/psy-tests-processor.gateway';
import {
  GeneratedDocument,
  TestVerdict,
} from '../../domain/types/psy-tests-processor.types';
import { PsyTestsProcessorClient } from '../../domain/interfaces/psy-tests-processor.client';
import {
  TESTS_PROCESSOR_PACKAGE_NAME,
  TESTS_PROCESSOR_SERVICE_NAME,
} from '../../domain/constants/tests-processor-package.constant';
import { type ClientGrpc } from '@nestjs/microservices';
import { GrpcFetcher } from '../../../shared/grpc/application/grpc-fetcher/grpc-fetcher.abstract';
import { status } from '@grpc/grpc-js';
import { UUID } from 'node:crypto';
import { TestAnswers } from '../../domain/types/test-answers.type';
import { User } from '../../../users/domain/entities/user.entity';
import {
  CalculateVerdictRequest,
  ProcessorTestResult,
} from '../../domain/types/psy-tests-processor.client.types';
import { TestResult } from '../../domain/entities/test-result.entity';
import { PatientNotSpecifiedError } from '../../domain/error/patient-not-specified.error';
import { TestVerdictIsEmptyError } from '../../domain/error/test-verdict-is-empty.error';

@Injectable()
export class GrpcTestsProcessorGateway
  implements PsyTestsProcessorGateway, OnModuleInit
{
  private readonly logger = new Logger(GrpcTestsProcessorGateway.name);
  private processorClient: PsyTestsProcessorClient;

  constructor(
    @Inject(TESTS_PROCESSOR_PACKAGE_NAME) private readonly client: ClientGrpc,
    private readonly grpcFetcher: GrpcFetcher,
  ) {}

  onModuleInit() {
    this.processorClient = this.client.getService<PsyTestsProcessorClient>(
      TESTS_PROCESSOR_SERVICE_NAME,
    );
  }

  async calculateVerdict(
    testId: UUID,
    patient: User,
    answers: TestAnswers,
  ): Promise<TestVerdict | null> {
    this.logger.debug(
      `Calculating verdict for test ${testId} for patient ${patient.name} ${patient.surname}...`,
    );

    const request: CalculateVerdictRequest = {
      test_id: testId,
      user: {
        name: patient.name,
        surname: patient.surname,
        patronymic: patient.patronymic,
        gender: patient.gender,
        birth_date: patient.birthDate,
      },
      answers: answers,
    };

    const observable = this.processorClient.calculateVerdict(request);

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => response.verdict,
      onFailure: {
        [status.NOT_FOUND]: () => null,
      },
    });
  }

  async generateDocument(
    testResult: TestResult,
  ): Promise<GeneratedDocument | null> {
    this.logger.debug(`Generating document for test result ${testResult.id}`);

    if (!testResult.completedByPatient) {
      throw new PatientNotSpecifiedError();
    }

    if (!testResult.verdictData) {
      throw new TestVerdictIsEmptyError(testResult.id);
    }

    const processorTestResult: ProcessorTestResult = {
      test_id: testResult.testId,
      test_result_id: testResult.id,
      passed_by: {
        name: testResult.completedByPatient.name,
        surname: testResult.completedByPatient.surname,
        patronymic: testResult.completedByPatient.patronymic,
        gender: testResult.completedByPatient.gender,
        birth_date: testResult.completedByPatient.birthDate,
      },
      answers: testResult.resultsData,
      verdict: testResult.verdictData,
      passed_at: testResult.completedAt,
    };

    const observable = this.processorClient.generateDocument({
      test_result: processorTestResult,
    });

    return this.grpcFetcher.fetch({
      request: observable,
      onSuccess: (response) => ({
        documentData: response.document_data,
        filename: response.filename,
      }),
      onFailure: {
        [status.NOT_FOUND]: () => null,
      },
    });
  }
}
