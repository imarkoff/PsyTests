import { GetPsyTestsHandler } from '../../../application/queries/get-psy-tests/get-psy-tests.handler';
import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { createPsyTestFixture } from '../../fixtures/psy-test.fixture';
import { PsyTestMapper } from '../../../application/mappers/psy-test.mapper';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

describe(GetPsyTestsHandler.name, () => {
  let getPsyTestsHandler: GetPsyTestsHandler;
  let psyTestsEngineGateway: Pick<
    jest.Mocked<PsyTestsEngineGateway>,
    'getAllTests'
  >;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestsHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: {
            getAllTests: jest.fn(),
          },
        },
      ],
    }).compile();

    getPsyTestsHandler = module.get(GetPsyTestsHandler);
    psyTestsEngineGateway = module.get(PsyTestsEngineGateway);
  });

  it('calls psyTestsEngineGateway.getAllTests', async () => {
    psyTestsEngineGateway.getAllTests.mockResolvedValue([]);

    await getPsyTestsHandler.execute();

    expect(psyTestsEngineGateway.getAllTests).toHaveBeenCalled();
  });

  it('should return an array of PsyTestDto', async () => {
    const mockPsyTests = [createPsyTestFixture()];
    const expectedDtos = mockPsyTests.map((test) => PsyTestMapper.toDto(test));
    psyTestsEngineGateway.getAllTests.mockResolvedValue(mockPsyTests);

    const result = await getPsyTestsHandler.execute();

    expect(result).toEqual(expectedDtos);
    expect(result[0]).toBeInstanceOf(PsyTestDto);
    expect(result[0]).not.toBeInstanceOf(PsyTestWithDetailsDto);
  });

  it('should propagate errors from psyTestsEngineGateway.getAllTests', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getAllTests.mockRejectedValue(mockError);

    await expect(getPsyTestsHandler.execute()).rejects.toThrow(mockError);
  });
});
