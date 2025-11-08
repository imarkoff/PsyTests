/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { randomUUID } from 'node:crypto';
import { GetPsyTestImageHandler } from '../../../application/queries/get-psy-test-image/get-psy-test-image.handler';
import { GetPsyTestImageQuery } from '../../../application/queries/get-psy-test-image/get-psy-test-image.query';

describe(GetPsyTestImageHandler.name, () => {
  let getPsyTestImageHandler: GetPsyTestImageHandler;
  let psyTestsEngineGateway: jest.Mocked<PsyTestsEngineGateway>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestImageHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: {
            getTestImage: jest.fn(),
          },
        },
      ],
    }).compile();

    getPsyTestImageHandler = module.get(GetPsyTestImageHandler);
    psyTestsEngineGateway = module.get(PsyTestsEngineGateway);
  });

  it('should call psyTestsEngineGateway.getTestImage and return its result', async () => {
    const testId = randomUUID();
    const imagePath = 'path/to/image.png';
    const buffer = Buffer.from('test image data');
    psyTestsEngineGateway.getTestImage.mockResolvedValue(buffer);

    const result = await getPsyTestImageHandler.execute({
      testId: testId,
      imagePath: imagePath,
    } as GetPsyTestImageQuery);

    expect(psyTestsEngineGateway.getTestImage).toHaveBeenCalled();
    expect(result).toBe(buffer);
  });

  it('should return null if engine returns null', async () => {
    const testId = randomUUID();
    const imagePath = 'non-existent-path/to/image.png';
    psyTestsEngineGateway.getTestImage.mockResolvedValue(null);

    const result = await getPsyTestImageHandler.execute({
      testId: testId,
      imagePath: imagePath,
    } as GetPsyTestImageQuery);

    expect(result).toBeNull();
  });

  it('should propagate errors from psyTestsEngineGateway.getTestImage', async () => {
    const mockError = new Error('Test error');
    psyTestsEngineGateway.getTestImage.mockRejectedValue(mockError);

    await expect(
      getPsyTestImageHandler.execute({
        testId: randomUUID(),
      } as GetPsyTestImageQuery),
    ).rejects.toThrow(mockError);
  });
});
