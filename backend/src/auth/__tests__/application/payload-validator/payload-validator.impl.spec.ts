/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { PayloadValidatorImpl } from '../../../application/payload-validator/payload-validator.impl';
import { GetUserModelByIdQuery } from '../../../../users/application/queries/get-user-model-by-id/get-user-model-by-id.query';
import { UserFromJwtNotFoundException } from '../../../domain/exceptions/user-from-jwt-not-found.exception';
import { User } from '../../../../users/domain/entities/user.entity';
import { randomUUID } from 'node:crypto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';

describe('PayloadValidatorImpl', () => {
  let service: PayloadValidatorImpl;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayloadValidatorImpl,
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PayloadValidatorImpl>(PayloadValidatorImpl);
    queryBus = module.get(QueryBus);
  });

  it('returns user when payload contains existing user id', async () => {
    const user = User.fromPersistence(createUserPersistence());

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
