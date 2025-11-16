import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { UserMapper } from '../../../application/mappers/user.mapper';
import { GetUserByPhoneHandler } from '../../../application/queries/get-user-by-phone/get-user-by-phone.handler';
import { GetUserByPhoneQuery } from '../../../application/queries/get-user-by-phone/get-user-by-phone.query';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(GetUserByPhoneHandler.name, () => {
  let handler: GetUserByPhoneHandler;
  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUserByPhone'> = {
    getUserByPhone: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetUserByPhoneHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    handler = module.get(GetUserByPhoneHandler);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = createUserFixture();
    userRepository.getUserByPhone.mockResolvedValue(mockUser);

    const result = await handler.execute({
      phoneNumber: mockUser.phone,
    } as GetUserByPhoneQuery);

    expect(result).toEqual(UserMapper.toDto(mockUser));
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(mockUser.phone);
  });

  it('returns null when user is not found', async () => {
    const phoneNumber = '+1234567890';
    userRepository.getUserByPhone.mockResolvedValue(null);

    const result = await handler.execute({
      phoneNumber,
    } as GetUserByPhoneQuery);

    expect(result).toBeNull();
    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(phoneNumber);
  });
});
