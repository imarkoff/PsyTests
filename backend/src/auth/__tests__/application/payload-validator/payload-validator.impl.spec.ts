import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { PayloadValidatorImpl } from '../../../application/payload-validator/payload-validator.impl';
import { GetUserModelByIdQuery } from '../../../../users/application/queries/get-user-model-by-id/get-user-model-by-id.query';
import { UserFromJwtNotFoundException } from '../../../domain/exceptions/user-from-jwt-not-found.exception';
import { randomUUID } from 'node:crypto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';

describe(PayloadValidatorImpl.name, () => {
  let service: PayloadValidatorImpl;

  const queryBus: Pick<jest.Mocked<QueryBus>, 'execute'> = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayloadValidatorImpl,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    }).compile();

    service = module.get<PayloadValidatorImpl>(PayloadValidatorImpl);
  });

  it('returns user when payload contains existing user id', async () => {
    const user = createUserFixture();
    queryBus.execute.mockResolvedValue(user);

    const result = await service.validatePayload({
      sub: user.id,
      role: user.role,
    });

    expect(result).toEqual(user);
    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetUserModelByIdQuery(user.id),
    );
  });

  it('throws UserFromJwtNotFoundException when user is not found for payload sub', async () => {
    const id = randomUUID();
    queryBus.execute.mockResolvedValue(null);

    await expect(
      service.validatePayload({ sub: id, role: UserRole.PATIENT }),
    ).rejects.toThrow(UserFromJwtNotFoundException);

    expect(queryBus.execute).toHaveBeenCalledWith(
      new GetUserModelByIdQuery(id),
    );
  });
});
