import { Test, TestingModule } from '@nestjs/testing';
import { LocalStrategy } from '../../../infrastructure/strategies/local.strategy';
import { AuthValidator } from '../../../application/auth-validator/auth-validator.abstract';
import { UnauthorizedException } from '@nestjs/common';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;

  const authValidator: Pick<jest.Mocked<AuthValidator>, 'validateUser'> = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthValidator,
          useValue: authValidator,
        },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when credentials are valid', async () => {
      const phoneNumber = '+1234567890';
      const password = 'password';
      const expectedUser = createUserFixture();
      (authValidator.validateUser as jest.Mock).mockResolvedValue(expectedUser);

      const result = await strategy.validate(phoneNumber, password);

      expect(authValidator.validateUser).toHaveBeenCalledWith(
        phoneNumber,
        password,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should throw an UnauthorizedException when credentials are invalid', async () => {
      const phoneNumber = '+1234567890';
      const password = 'wrongpassword';
      const error = new UnauthorizedException();
      (authValidator.validateUser as jest.Mock).mockRejectedValue(error);

      await expect(strategy.validate(phoneNumber, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authValidator.validateUser).toHaveBeenCalledWith(
        phoneNumber,
        password,
      );
    });
  });
});
