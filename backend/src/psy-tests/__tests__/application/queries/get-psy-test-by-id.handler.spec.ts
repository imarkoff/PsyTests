import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { GetPsyTestByIdHandler } from '../../../application/queries/get-psy-test-by-id/get-psy-test-by-id.handler';
import { GetPsyTestByIdQuery } from '../../../application/queries/get-psy-test-by-id/get-psy-test-by-id.query';
import { randomUUID } from 'node:crypto';
import { createPsyTestFixture } from '../../fixtures/psy-test.fixture';
import { PsyTestMapper } from '../../../application/mappers/psy-test.mapper';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

describe(GetPsyTestByIdHandler.name, () => {
  let getPsyTestByIdHandler: GetPsyTestByIdHandler;
  let psyTestsEngineGateway: Pick<
    jest.Mocked<PsyTestsEngineGateway>,
    'getTestById'
  >;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestByIdHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: {
            getTestById: jest.fn(),
          },
        },
      ],
    }).compile();

    getPsyTestByIdHandler = module.get(GetPsyTestByIdHandler);
    psyTestsEngineGateway = module.get(PsyTestsEngineGateway);
  });

  it('should call psyTestsEngineGateway.getTestById and return its result', async () => {
    const mockPsyTest = createPsyTestFixture();
    const expectedDto = PsyTestMapper.withDetailsToDto(mockPsyTest);
    psyTestsEngineGateway.getTestById.mockResolvedValue(mockPsyTest);

    const result = await getPsyTestByIdHandler.execute({
      testId: mockPsyTest.id,
    } as GetPsyTestByIdQuery);

    expect(psyTestsEngineGateway.getTestById).toHaveBeenCalled();
    expect(result).toEqual(expectedDto);
    expect(result).toBeInstanceOf(PsyTestWithDetailsDto);
  });

  it('should return null if test not found', async () => {
    psyTestsEngineGateway.getTestById.mockResolvedValue(null);

    const result = await getPsyTestByIdHandler.execute({
      testId: randomUUID(),
    } as GetPsyTestByIdQuery);

    expect(result).toBeNull();
  });

  it('should propagate errors from psyTestsEngineGateway.getTestById', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getTestById.mockRejectedValue(mockError);

    await expect(
      getPsyTestByIdHandler.execute({
        testId: randomUUID(),
      } as GetPsyTestByIdQuery),
    ).rejects.toThrow(mockError);
  });
});
