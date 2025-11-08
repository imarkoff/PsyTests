/* eslint-disable @typescript-eslint/unbound-method */
import { GetPsyTestsHandler } from '../../../application/queries/get-psy-tests/get-psy-tests.handler';
import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { createPsyTestDtoFixture } from '../../fixtures/psy-test-dto.fixture';

describe(GetPsyTestsHandler.name, () => {
  let getPsyTestsHandler: GetPsyTestsHandler;
  let psyTestsEngineGateway: jest.Mocked<PsyTestsEngineGateway>;

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

  it('should call psyTestsEngineGateway.getAllTests and return its result', async () => {
    const mockPsyTests: PsyTestDto[] = [createPsyTestDtoFixture()];
    psyTestsEngineGateway.getAllTests.mockResolvedValue(mockPsyTests);

    const result = await getPsyTestsHandler.execute();

    expect(psyTestsEngineGateway.getAllTests).toHaveBeenCalled();
    expect(result).toBe(mockPsyTests);
  });

  it('should propagate errors from psyTestsEngineGateway.getAllTests', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getAllTests.mockRejectedValue(mockError);

    await expect(getPsyTestsHandler.execute()).rejects.toThrow(mockError);
  });
});
