/* eslint-disable @typescript-eslint/unbound-method */
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { User } from '../../../domain/entities/user.entity';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { GetUserModelByPhoneQuery } from '../../../application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { GetUserModelByPhoneHandler } from '../../../application/queries/get-user-model-by-phone/get-user-model-by-phone.handler';

describe(GetUserModelByPhoneHandler.name, () => {
  let handler: GetUserModelByPhoneHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserModelByPhoneHandler,
        {
          provide: UserRepository,
          useValue: {
            getUserByPhone: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetUserModelByPhoneHandler);
    userRepository = module.get(UserRepository);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = User.fromPersistence(createUserPersistence());
    userRepository.getUserByPhone.mockResolvedValue(mockUser);

    const result = await handler.execute({
      phoneNumber: mockUser.phone,
    } as GetUserModelByPhoneQuery);

    expect(result).toEqual(mockUser);
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(mockUser.phone);
  });

  it('returns null when user is not found', async () => {
    const phoneNumber = '+1234567890';
    userRepository.getUserByPhone.mockResolvedValue(null);

    const result = await handler.execute({
      phoneNumber,
    } as GetUserModelByPhoneQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(phoneNumber);
  });
});
