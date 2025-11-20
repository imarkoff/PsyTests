import { PassAssignedTestHandler } from '../../../application/commands/pass-assigned-test/pass-assigned-test.handler';
import { QueryBus } from '@nestjs/cqrs';
import { TestResultsRepository } from '../../../domain/interfaces/test-results.repository';
import { Test } from '@nestjs/testing';
import { createAssignedTestFixture } from '../../fixtures/assigned-test.fixture';
import { createTestResultFixture } from '../../fixtures/test-result.fixture';
import { PassAssignedTestCommand } from '../../../application/commands/pass-assigned-test/pass-assigned-test.command';
import { GetAssignedTestByTestIdAndPatientIdOrThrowQuery } from '../../../application/queries/get-assigned-test-by-test-id-and-patient-id-or-throw/get-assigned-test-by-test-id-and-patient-id-or-throw.query';
import { AssignedTestByTestIdAndPatientIdNotFoundException } from '../../../domain/exceptions/assigned-test-by-test-id-and-patient-id-not-found.exception';
import { randomUUID } from 'node:crypto';
import { TestResult } from '../../../domain/entities/test-result.entity';
import { TestResultMapper } from '../../../application/mappers/test-result.mapper';
import { createPsyTestFixture } from '../../../../psy-tests/__tests__/fixtures/psy-test.fixture';
import { AssignedTestMapper } from '../../../application/mappers/assigned-test.mapper';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';

describe(PassAssignedTestHandler.name, () => {
  let handler: PassAssignedTestHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<jest.Mocked<TestResultsRepository>, 'create'>;

  const assignedTest = createAssignedTestFixture();
  const psyTest = createPsyTestFixture({
    testId: assignedTest.testId,
  });
  const assignedTestDto = AssignedTestMapper.toDto(assignedTest, psyTest);
  const answers: Record<string, any> = {
    question1: 'answer1',
    question2: 'answer2',
  };
  const testResult = createTestResultFixture({
    testId: assignedTest.testId,
    completedByPatientId: assignedTest.assignedToPatientId,
    resultsData: answers,
  });

  const setupSuccessfulExecution = () => {
    queryBus.execute.mockResolvedValue(assignedTestDto);
    repository.create.mockResolvedValue(testResult);
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PassAssignedTestHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
        {
          provide: TestResultsRepository,
          useValue: <typeof repository>{
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(PassAssignedTestHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(TestResultsRepository);
  });

  it('should call GetAssignedTestByTestIdAndPatientIdOrThrowQuery with correct values', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: assignedTest.testId,
      passedByPatientId: assignedTest.assignedToPatientId,
      answers,
    } as PassAssignedTestCommand);

    const queryCall = queryBus.execute.mock.calls[0][0];

    expect(queryCall).toBeInstanceOf(
      GetAssignedTestByTestIdAndPatientIdOrThrowQuery,
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining<
        Partial<GetAssignedTestByTestIdAndPatientIdOrThrowQuery>
      >({
        testId: assignedTest.testId,
        patientId: assignedTest.assignedToPatientId,
      }),
    );
  });

  it('should propagate exception from QueryBus', async () => {
    const testId = randomUUID();
    const patientId = randomUUID();
    const expectedError = new AssignedTestByTestIdAndPatientIdNotFoundException(
      testId,
      patientId,
    );
    queryBus.execute.mockRejectedValue(expectedError);

    await expect(
      handler.execute({
        testId,
        passedByPatientId: patientId,
        answers,
      } as PassAssignedTestCommand),
    ).rejects.toThrow(expectedError);
  });

  it('should call TestResultsRepository.create with correct values', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: assignedTest.testId,
      passedByPatientId: assignedTest.assignedToPatientId,
      answers,
    } as PassAssignedTestCommand);

    const createCall = repository.create.mock.calls[0][0];

    expect(createCall).toBeInstanceOf(TestResult);
    expect(createCall).toMatchObject<Partial<TestResult>>({
      testId: assignedTest.testId,
      completedByPatientId: assignedTest.assignedToPatientId,
      resultsData: answers,
    });
  });

  it('should return correct TestResultShortDto on successful execution', async () => {
    const expectedDto = TestResultMapper.toShortDto(testResult, psyTest);
    setupSuccessfulExecution();

    const result = await handler.execute({
      testId: assignedTest.testId,
      passedByPatientId: assignedTest.assignedToPatientId,
      answers,
    } as PassAssignedTestCommand);

    expect(result).toEqual(expectedDto);
    expect(result).toBeInstanceOf(TestResultShortDto);
  });
});
