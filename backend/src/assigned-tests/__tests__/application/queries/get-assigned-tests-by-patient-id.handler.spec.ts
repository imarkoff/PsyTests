import { GetAssignedTestsByPatientIdHandler } from '../../../application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.handler';
import { QueryBus } from '@nestjs/cqrs';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { createAssignedTestFixture } from '../../fixtures/assigned-test.fixture';
import { createPsyTestDtoFixture } from '../../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { PsyTestNotFoundException } from '../../../../psy-tests/domain/exceptions/psy-test-not-found.exception';
import { GetAssignedTestsByPatientIdQuery } from '../../../application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.query';
import { AssignedTestMapper } from '../../../application/mappers/assigned-test.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';

describe(GetAssignedTestsByPatientIdHandler.name, () => {
  let handler: GetAssignedTestsByPatientIdHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<
    jest.Mocked<AssignedTestsRepository>,
    'getAssignedTestsByPatientId'
  >;

  const psyTests = [createPsyTestDtoFixture(), createPsyTestDtoFixture()];
  const assignedTests = psyTests.map((t) =>
    createAssignedTestFixture({ testId: t.id }),
  );

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAssignedTestsByPatientIdHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest
              .fn()
              .mockImplementation(
                ({ testId }: GetPsyTestMetadataByIdOrThrowQuery) => {
                  const test = psyTests.find((t) => t.id === testId);
                  if (!test) {
                    throw new PsyTestNotFoundException(testId);
                  }
                  return Promise.resolve(test);
                },
              ),
          },
        },
        {
          provide: AssignedTestsRepository,
          useValue: <typeof repository>{
            getAssignedTestsByPatientId: jest
              .fn()
              .mockResolvedValue(assignedTests),
          },
        },
      ],
    }).compile();

    handler = module.get(GetAssignedTestsByPatientIdHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(AssignedTestsRepository);
  });

  it('should return assigned tests with psy test metadata', async () => {
    const patientId = randomUUID();
    const expectedResult = assignedTests.map((at, index) =>
      AssignedTestMapper.toDto(at, psyTests[index]),
    );

    const result = await handler.execute({
      patientId,
    } as GetAssignedTestsByPatientIdQuery);

    expect(result).toEqual(expectedResult);
  });

  it('should call repository with correct parameters', async () => {
    const patientId = randomUUID();

    await handler.execute({
      patientId,
    } as GetAssignedTestsByPatientIdQuery);

    expect(repository.getAssignedTestsByPatientId).toHaveBeenCalledWith(
      patientId,
    );
  });

  it('should call query bus with correct parameters', async () => {
    const patientId = randomUUID();

    await handler.execute({
      patientId,
    } as GetAssignedTestsByPatientIdQuery);

    for (const [index, queryCall] of queryBus.execute.mock.calls.entries()) {
      const calledWithTestId =
        queryCall[0] as GetPsyTestMetadataByIdOrThrowQuery;
      expect(calledWithTestId).toBeInstanceOf(
        GetPsyTestMetadataByIdOrThrowQuery,
      );
      expect(calledWithTestId).toEqual(<GetPsyTestMetadataByIdOrThrowQuery>{
        testId: assignedTests[index].testId,
      });
    }
  });

  it('should propagate exception if psy test not found', async () => {
    const patientId = randomUUID();
    const nonExistentTestId = randomUUID();
    const error = new PsyTestNotFoundException(nonExistentTestId);
    queryBus.execute.mockRejectedValue(error);

    await expect(
      handler.execute({
        patientId,
      } as GetAssignedTestsByPatientIdQuery),
    ).rejects.toThrow(error);
  });
});
