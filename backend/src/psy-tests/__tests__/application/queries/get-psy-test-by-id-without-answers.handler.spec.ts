/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { createPsyTestDtoFixture } from '../../fixtures/psy-test-dto.fixture';
import { randomUUID } from 'node:crypto';
import { GetPsyTestByIdWithoutAnswersHandler } from '../../../application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.handler';
import { GetPsyTestByIdWithoutAnswersQuery } from '../../../application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.query';

describe(GetPsyTestByIdWithoutAnswersHandler.name, () => {
  let getPsyTestByIdWithoutAnswersHandler: GetPsyTestByIdWithoutAnswersHandler;
  let psyTestsEngineGateway: jest.Mocked<PsyTestsEngineGateway>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestByIdWithoutAnswersHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: {
            getTestByIdWithoutAnswers: jest.fn(),
          },
        },
      ],
    }).compile();

    getPsyTestByIdWithoutAnswersHandler = module.get(
      GetPsyTestByIdWithoutAnswersHandler,
    );
    psyTestsEngineGateway = module.get(PsyTestsEngineGateway);
  });

  it('should call psyTestsEngineGateway.getTestByIdWithoutAnswers and return its result', async () => {
    const mockPsyTest = createPsyTestDtoFixture();
    psyTestsEngineGateway.getTestByIdWithoutAnswers.mockResolvedValue(
      mockPsyTest,
    );

    const result = await getPsyTestByIdWithoutAnswersHandler.execute({
      testId: mockPsyTest.id,
    } as GetPsyTestByIdWithoutAnswersQuery);

    expect(psyTestsEngineGateway.getTestByIdWithoutAnswers).toHaveBeenCalled();
    expect(result).toBe(mockPsyTest);
  });

  it('should return null if test not found', async () => {
    psyTestsEngineGateway.getTestByIdWithoutAnswers.mockResolvedValue(null);

    const result = await getPsyTestByIdWithoutAnswersHandler.execute({
      testId: randomUUID(),
    } as GetPsyTestByIdWithoutAnswersQuery);

    expect(result).toBeNull();
  });

  it('should propagate errors from psyTestsEngineGateway.getTestByIdWithoutAnswers', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getTestByIdWithoutAnswers.mockRejectedValue(
      mockError,
    );

    await expect(
      getPsyTestByIdWithoutAnswersHandler.execute({
        testId: randomUUID(),
      } as GetPsyTestByIdWithoutAnswersQuery),
    ).rejects.toThrow(mockError);
  });
});
