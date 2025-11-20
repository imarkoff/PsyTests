import { GetAssignedTestByTestIdAndPatientIdOrThrowHandler } from '../../application/queries/get-assigned-test-by-test-id-and-patient-id-or-throw/get-assigned-test-by-test-id-and-patient-id-or-throw.handler';
import { QueryBus } from '@nestjs/cqrs';
import { AssignedTestsRepository } from '../../domain/interfaces/assigned-tests.repository';
import { Test } from '@nestjs/testing';
import { createPsyTestDtoFixture } from '../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';
import { createAssignedTestFixture } from '../fixtures/assigned-test.fixture';
import { AssignedTestMapper } from '../../application/mappers/assigned-test.mapper';
import { GetAssignedTestByTestIdAndPatientIdOrThrowQuery } from '../../application/queries/get-assigned-test-by-test-id-and-patient-id-or-throw/get-assigned-test-by-test-id-and-patient-id-or-throw.query';
import { AssignedTestByTestIdAndPatientIdNotFoundException } from '../../domain/exceptions/assigned-test-by-test-id-and-patient-id-not-found.exception';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestNotFoundException } from '../../../psy-tests/domain/exceptions/psy-test-not-found.exception';

describe(GetAssignedTestByTestIdAndPatientIdOrThrowHandler.name, () => {
  let handler: GetAssignedTestByTestIdAndPatientIdOrThrowHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<
    jest.Mocked<AssignedTestsRepository>,
    'getAssignedTestByTestIdAndPatientId'
  >;

  const mockTest = createPsyTestDtoFixture();
  const mockAssignedTest = createAssignedTestFixture();

  const setupSuccessfulExecution = () => {
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValue(
      mockAssignedTest,
    );
    queryBus.execute.mockResolvedValue(mockTest);
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAssignedTestByTestIdAndPatientIdOrThrowHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
        {
          provide: AssignedTestsRepository,
          useValue: <typeof repository>{
            getAssignedTestByTestIdAndPatientId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetAssignedTestByTestIdAndPatientIdOrThrowHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(AssignedTestsRepository);
  });

  it('should return the assigned test dto', async () => {
    const expectedDto = AssignedTestMapper.toDto(mockAssignedTest, mockTest);
    setupSuccessfulExecution();

    const result = await handler.execute({
      testId: mockTest.id,
      patientId: mockAssignedTest.assignedToPatientId,
    } as GetAssignedTestByTestIdAndPatientIdOrThrowQuery);

    expect(result).toEqual(expectedDto);
  });

  it('should throw AssignedTestByTestIdAndPatientIdNotFoundException when assigned test is not found', async () => {
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValue(null);

    await expect(
      handler.execute({
        testId: mockTest.id,
        patientId: mockAssignedTest.assignedToPatientId,
      } as GetAssignedTestByTestIdAndPatientIdOrThrowQuery),
    ).rejects.toThrow(AssignedTestByTestIdAndPatientIdNotFoundException);
  });

  it('should call repository.getAssignedTestByTestIdAndPatientId with correct parameters', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      patientId: mockAssignedTest.assignedToPatientId,
    } as GetAssignedTestByTestIdAndPatientIdOrThrowQuery);

    expect(repository.getAssignedTestByTestIdAndPatientId).toHaveBeenCalledWith(
      mockTest.id,
      mockAssignedTest.assignedToPatientId,
    );
  });

  it('should call queryBus.execute with GetPsyTestMetadataByIdOrThrowQuery', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      patientId: mockAssignedTest.assignedToPatientId,
    } as GetAssignedTestByTestIdAndPatientIdOrThrowQuery);

    const queryBusCall = queryBus.execute.mock.calls[0][0];
    expect(queryBusCall).toBeInstanceOf(GetPsyTestMetadataByIdOrThrowQuery);
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        testId: mockTest.id,
      } as GetPsyTestMetadataByIdOrThrowQuery),
    );
  });

  it('should propagate exceptions from the query bus', async () => {
    const error = new PsyTestNotFoundException(mockTest.id);
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValue(
      mockAssignedTest,
    );
    queryBus.execute.mockRejectedValue(error);

    await expect(
      handler.execute({
        testId: mockTest.id,
        patientId: mockAssignedTest.assignedToPatientId,
      } as GetAssignedTestByTestIdAndPatientIdOrThrowQuery),
    ).rejects.toThrow(error);
  });
});
