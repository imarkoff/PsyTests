import { GetPsyTestMetadataByIdOrThrowHandler } from '../../../application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.handler';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { Test } from '@nestjs/testing';
import { createPsyTestFixture } from '../../fixtures/psy-test.fixture';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestMapper } from '../../../application/mappers/psy-test.mapper';
import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';
import { PsyTestNotFoundException } from '../../../domain/exceptions/psy-test-not-found.exception';
import { randomUUID } from 'node:crypto';

describe(GetPsyTestMetadataByIdOrThrowHandler.name, () => {
  let handler: GetPsyTestMetadataByIdOrThrowHandler;

  const gateway: Pick<
    jest.Mocked<PsyTestsEngineGateway>,
    'getTestMetadataById'
  > = {
    getTestMetadataById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetPsyTestMetadataByIdOrThrowHandler,
        {
          provide: PsyTestsEngineGateway,
          useValue: gateway,
        },
      ],
    }).compile();

    handler = module.get(GetPsyTestMetadataByIdOrThrowHandler);
  });

  it('should call gateway with correct params', async () => {
    const test = createPsyTestFixture();
    gateway.getTestMetadataById.mockResolvedValue(test);

    await handler.execute({
      testId: test.id,
    } as GetPsyTestMetadataByIdOrThrowQuery);

    expect(gateway.getTestMetadataById).toHaveBeenCalledWith(test.id);
  });

  it('should return PsyTestDto when found', async () => {
    const test = createPsyTestFixture();
    const expectedDto = PsyTestMapper.toDto(test);
    gateway.getTestMetadataById.mockResolvedValue(test);

    const result = await handler.execute({
      testId: test.id,
    } as GetPsyTestMetadataByIdOrThrowQuery);

    expect(result).toEqual(expectedDto);
    expect(result).toBeInstanceOf(PsyTestDto);
    expect(result).not.toBeInstanceOf(PsyTestWithDetailsDto);
  });

  it('should throw when test not found', async () => {
    gateway.getTestMetadataById.mockResolvedValue(null);

    await expect(
      handler.execute({
        testId: randomUUID(),
      } as GetPsyTestMetadataByIdOrThrowQuery),
    ).rejects.toThrow(PsyTestNotFoundException);
  });
});
