import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { randomUUID } from 'node:crypto';
import { GetPsyTestByIdWithoutAnswersHandler } from '../../../application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.handler';
import { GetPsyTestByIdWithoutAnswersQuery } from '../../../application/queries/get-psy-test-by-id-without-answers/get-psy-test-by-id-without-answers.query';
import { createPsyTestFixture } from '../../fixtures/psy-test.fixture';
import { PsyTestMapper } from '../../../application/mappers/psy-test.mapper';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

describe(GetPsyTestByIdWithoutAnswersHandler.name, () => {
  let getPsyTestByIdWithoutAnswersHandler: GetPsyTestByIdWithoutAnswersHandler;
  let psyTestsEngineGateway: Pick<
    jest.Mocked<PsyTestsEngineGateway>,
    'getTestByIdWithoutAnswers'
  >;

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
    const mockPsyTest = createPsyTestFixture();
    const expectedDto = PsyTestMapper.withDetailsToDto(mockPsyTest);
    psyTestsEngineGateway.getTestByIdWithoutAnswers.mockResolvedValue(
      mockPsyTest,
    );

    const result = await getPsyTestByIdWithoutAnswersHandler.execute({
      testId: mockPsyTest.id,
    } as GetPsyTestByIdWithoutAnswersQuery);

    expect(psyTestsEngineGateway.getTestByIdWithoutAnswers).toHaveBeenCalled();
    expect(result).toEqual(expectedDto);
    expect(result).toBeInstanceOf(PsyTestWithDetailsDto);
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
