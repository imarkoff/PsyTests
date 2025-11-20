import { GetShortTestResultsByPatientIdHandler } from '../../../application/queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.handler';
import { QueryBus } from '@nestjs/cqrs';
import { TestResultsRepository } from '../../../domain/interfaces/test-results.repository';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { createTestResultFixture } from '../../fixtures/test-result.fixture';
import { createPsyTestDtoFixture } from '../../../../psy-tests/__tests__/fixtures/psy-test-dto.fixture';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestNotFoundException } from '../../../../psy-tests/domain/exceptions/psy-test-not-found.exception';
import { TestResultMapper } from '../../../application/mappers/test-result.mapper';
import { GetShortTestResultsByPatientIdQuery } from '../../../application/queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.query';

describe(GetShortTestResultsByPatientIdHandler.name, () => {
  let handler: GetShortTestResultsByPatientIdHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<
    jest.Mocked<TestResultsRepository>,
    'getByPatientIdDesc'
  >;

  const patientId = randomUUID();
  const psyTests = [createPsyTestDtoFixture(), createPsyTestDtoFixture()];
  const testResults = psyTests.map((t) =>
    createTestResultFixture({
      testId: t.id,
      completedByPatientId: patientId,
    }),
  );

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetShortTestResultsByPatientIdHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest
              .fn()
              .mockImplementation(
                ({ testId }: GetPsyTestMetadataByIdOrThrowQuery) => {
                  const test = psyTests.find((t) => t.id === testId);
                  if (!test) throw new PsyTestNotFoundException(testId);
                  return test;
                },
              ),
          },
        },
        {
          provide: TestResultsRepository,
          useValue: <typeof repository>{
            getByPatientIdDesc: jest.fn().mockResolvedValue(testResults),
          },
        },
      ],
    }).compile();

    handler = module.get(GetShortTestResultsByPatientIdHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(TestResultsRepository);
  });

  it('should return a list of short DTOs', async () => {
    const expectedDtos = testResults.map((result, index) =>
      TestResultMapper.toShortDto(result, psyTests[index]),
    );

    const dtos = await handler.execute({
      patientId,
    } as GetShortTestResultsByPatientIdQuery);

    expect(dtos).toEqual(expectedDtos);
  });

  it('calls the repository with correct params', async () => {
    await handler.execute({
      patientId,
    } as GetShortTestResultsByPatientIdQuery);

    expect(repository.getByPatientIdDesc).toHaveBeenCalledWith(patientId);
  });

  it('calls the query bus with correct params', async () => {
    await handler.execute({
      patientId,
    } as GetShortTestResultsByPatientIdQuery);

    for (const [index, queryCall] of queryBus.execute.mock.calls.entries()) {
      const query = queryCall[0] as GetPsyTestMetadataByIdOrThrowQuery;
      expect(query).toBeInstanceOf(GetPsyTestMetadataByIdOrThrowQuery);
      expect(query.testId).toBe(testResults[index].testId);
    }
  });

  it('propagates exception when psy test not found', async () => {
    const invalidTestId = randomUUID();
    const error = new PsyTestNotFoundException(invalidTestId);
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(
      handler.execute({
        patientId,
      } as GetShortTestResultsByPatientIdQuery),
    ).rejects.toThrow(PsyTestNotFoundException);
  });
});
