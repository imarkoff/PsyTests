import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { Test } from '@nestjs/testing';
import { GetUserModelByPhoneQuery } from '../../../application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { GetUserModelByPhoneHandler } from '../../../application/queries/get-user-model-by-phone/get-user-model-by-phone.handler';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(GetUserModelByPhoneHandler.name, () => {
  let handler: GetUserModelByPhoneHandler;
  const userRepository: Pick<jest.Mocked<UserRepository>, 'getUserByPhone'> = {
    getUserByPhone: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetUserModelByPhoneHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    handler = module.get(GetUserModelByPhoneHandler);
  });

  it('returns user dto when user is found', async () => {
    const mockUser = createUserFixture();
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
