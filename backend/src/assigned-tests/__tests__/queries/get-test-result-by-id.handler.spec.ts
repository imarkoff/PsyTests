import { GetTestResultByIdHandler } from '../../application/queries/get-test-result-by-id/get-test-result-by-id.handler';
import { createPsyTestDtoFixture } from '../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';
import { createTestResultFixture } from '../fixtures/test-result.fixture';
import { QueryBus } from '@nestjs/cqrs';
import { TestResultsRepository } from '../../domain/interfaces/test-results.repository';
import { Test } from '@nestjs/testing';
import { TestResultMapper } from '../../application/mappers/test-result.mapper';
import { GetTestResultByIdQuery } from '../../application/queries/get-test-result-by-id/get-test-result-by-id.query';
import { randomUUID } from 'node:crypto';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestNotFoundException } from '../../../psy-tests/domain/exceptions/psy-test-not-found.exception';

describe(GetTestResultByIdHandler.name, () => {
  let handler: GetTestResultByIdHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<jest.Mocked<TestResultsRepository>, 'getById'>;

  const mockTest = createPsyTestDtoFixture();
  const testResult = createTestResultFixture({ testId: mockTest.id });

  const setupSuccessfulExecution = () => {
    repository.getById.mockResolvedValue(testResult);
    queryBus.execute.mockResolvedValue(mockTest);
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetTestResultByIdHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
        {
          provide: TestResultsRepository,
          useValue: <typeof repository>{
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetTestResultByIdHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(TestResultsRepository);
  });

  it('should return test result dto when found', async () => {
    const expectedDto = TestResultMapper.toDto(testResult, mockTest);
    setupSuccessfulExecution();

    const result = await handler.execute({
      testResultId: testResult.id,
    } as GetTestResultByIdQuery);

    expect(result).toEqual(expectedDto);
  });

  it('should return null when test result not found', async () => {
    const nonExistingId = randomUUID();
    repository.getById.mockResolvedValue(null);

    const result = await handler.execute({
      testResultId: nonExistingId,
    } as GetTestResultByIdQuery);

    expect(result).toBeNull();
  });

  it('calls the repository with correct parameters', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testResultId: testResult.id,
    } as GetTestResultByIdQuery);

    expect(repository.getById).toHaveBeenCalledWith(testResult.id);
  });

  it('calls the QueryBus with correct parameters', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testResultId: testResult.id,
    } as GetTestResultByIdQuery);

    const queryCall = queryBus.execute.mock.calls[0][0];
    expect(queryCall).toBeInstanceOf(GetPsyTestMetadataByIdOrThrowQuery);
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ testId: testResult.testId }),
    );
  });

  it('should not call QueryBus when test result not found', async () => {
    const nonExistingId = randomUUID();
    repository.getById.mockResolvedValue(null);

    await handler.execute({
      testResultId: nonExistingId,
    } as GetTestResultByIdQuery);

    expect(queryBus.execute).not.toHaveBeenCalled();
  });

  it('propagates errors from the QueryBus', async () => {
    const nonExistingId = randomUUID();
    const error = new PsyTestNotFoundException(nonExistingId);
    repository.getById.mockResolvedValue(testResult);
    queryBus.execute.mockRejectedValue(error);

    await expect(
      handler.execute({
        testResultId: testResult.id,
      } as GetTestResultByIdQuery),
    ).rejects.toThrow(error);
  });
});
