import { Test, TestingModule } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { AuthValidatorImpl } from '../../../application/auth-validator/auth-validator.impl';
import { GetUserModelByPhoneQuery } from '../../../../users/application/queries/get-user-model-by-phone/get-user-model-by-phone.query';
import { InvalidLoginDetailsException } from '../../../domain/exceptions/invalid-login-details.exception';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { Buffer } from 'node:buffer';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';

describe(AuthValidatorImpl.name, () => {
  let service: AuthValidatorImpl;

  const queryBus: Pick<jest.Mocked<QueryBus>, 'execute'> = {
    execute: jest.fn(),
  };
  const passwordService: Pick<
    jest.Mocked<PasswordService>,
    'verifyPassword'
  > = {
    verifyPassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthValidatorImpl,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
      ],
    }).compile();

    service = module.get<AuthValidatorImpl>(AuthValidatorImpl);
  });

  describe('validateUser', () => {
    it('should return user for valid phone and password', async () => {
      const phone = '+1234567890';
      const password = 'password';
      const passwordHash = Buffer.from('hash');
      const passwordSalt = Buffer.from('salt');
      const user = createUserFixture({
        phone,
        password: passwordHash,
        passwordSalt,
      });
      queryBus.execute.mockResolvedValue(user);
      passwordService.verifyPassword.mockResolvedValue(true);

      const result = await service.validateUser(phone, password);

      expect(result).toEqual(user);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserModelByPhoneQuery(phone),
      );
      expect(passwordService.verifyPassword).toHaveBeenCalledWith(password, {
        hash: passwordHash,
        salt: passwordSalt,
      });
    });

    it('should throw InvalidLoginDetailsException for non-existent user', async () => {
      queryBus.execute.mockResolvedValue(null);

      await expect(
        service.validateUser('1234567890', 'password'),
      ).rejects.toThrow(InvalidLoginDetailsException);
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserModelByPhoneQuery('1234567890'),
      );
      expect(passwordService.verifyPassword).not.toHaveBeenCalled();
    });

    it('should throw InvalidLoginDetailsException for invalid password', async () => {
      const phone = '+1234567890';
      const password = 'wrongpassword';
      const passwordHash = Buffer.from('hash');
      const passwordSalt = Buffer.from('salt');
      const user = createUserFixture({
        phone,
        password: passwordHash,
        passwordSalt,
      });
      queryBus.execute.mockResolvedValue(user);
      passwordService.verifyPassword.mockResolvedValue(false);

      await expect(service.validateUser(phone, password)).rejects.toThrow(
        InvalidLoginDetailsException,
      );
      expect(queryBus.execute).toHaveBeenCalledWith(
        new GetUserModelByPhoneQuery(phone),
      );
      expect(passwordService.verifyPassword).toHaveBeenCalledWith(password, {
        hash: passwordHash,
        salt: passwordSalt,
      });
    });
  });
});
