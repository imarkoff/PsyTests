/* eslint-disable @typescript-eslint/unbound-method */
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { User } from '../../../domain/entities/user.entity';
import { UserMapper } from '../../../application/mappers/user.mapper';
import { GetUserByPhoneHandler } from '../../../application/queries/get-user-by-phone/get-user-by-phone.handler';
import { GetUserByPhoneQuery } from '../../../application/queries/get-user-by-phone/get-user-by-phone.query';

describe(GetUserByPhoneHandler.name, () => {
  let handler: GetUserByPhoneHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserByPhoneHandler,
        {
          provide: UserRepository,
          useValue: {
            getUserByPhone: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetUserByPhoneHandler);
    userRepository = module.get(UserRepository);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = User.fromPersistence(createUserPersistence());
    userRepository.getUserByPhone.mockResolvedValue(mockUser);

    const result = await handler.execute({
      phoneNumber: mockUser.phone,
    } as GetUserByPhoneQuery);

    expect(result).toEqual(UserMapper.toDto(mockUser));
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(mockUser.phone);
  });

  it('returns null when user is not found', async () => {
    const phoneNumber = '+1234567890';

    const result = await handler.execute({
      phoneNumber,
    } as GetUserByPhoneQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(phoneNumber);
  });
});
