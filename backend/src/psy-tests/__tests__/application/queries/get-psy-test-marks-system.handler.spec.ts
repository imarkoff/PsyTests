/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { randomUUID } from 'node:crypto';
import { GetPsyTestsMarksSystemHandler } from '../../../application/queries/get-psy-test-marks-system/get-psy-tests-marks-system.handler';
import { GetPsyTestImageQuery } from '../../../application/queries/get-psy-test-image/get-psy-test-image.query';

describe(GetPsyTestsMarksSystemHandler.name, () => {
  let getPsyTestsMarksSystemHandler: GetPsyTestsMarksSystemHandler;
  let psyTestsEngineGateway: jest.Mocked<PsyTestsEngineGateway>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestsMarksSystemHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: {
            getTestMarksSystem: jest.fn(),
          },
        },
      ],
    }).compile();

    getPsyTestsMarksSystemHandler = module.get(GetPsyTestsMarksSystemHandler);
    psyTestsEngineGateway = module.get(PsyTestsEngineGateway);
  });

  it('should call psyTestsEngineGateway.getTestMarksSystem and return its result', async () => {
    const testId = randomUUID();
    const mockMarksSystem = {
      description: 'Sample Marks System',
      levels: [{ level: 'A', minScore: 90, maxScore: 100 }],
    };
    psyTestsEngineGateway.getTestMarksSystem.mockResolvedValue(mockMarksSystem);

    const result = await getPsyTestsMarksSystemHandler.execute({
      testId: testId,
    } as GetPsyTestImageQuery);

    expect(psyTestsEngineGateway.getTestMarksSystem).toHaveBeenCalledWith(
      testId,
    );
    expect(result).toBe(mockMarksSystem);
  });

  it('should return null if gateway returns null', async () => {
    psyTestsEngineGateway.getTestMarksSystem.mockResolvedValue(null);

    const result = await getPsyTestsMarksSystemHandler.execute({
      testId: randomUUID(),
    } as GetPsyTestImageQuery);

    expect(result).toBeNull();
  });

  it('should propagate errors from psyTestsEngineGateway.getTestMarksSystem', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getTestMarksSystem.mockRejectedValue(mockError);

    await expect(
      getPsyTestsMarksSystemHandler.execute({
        testId: randomUUID(),
      } as GetPsyTestImageQuery),
    ).rejects.toThrow(mockError);
  });
});
