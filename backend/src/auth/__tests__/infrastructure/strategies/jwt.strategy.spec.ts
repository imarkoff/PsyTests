/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../../infrastructure/strategies/jwt.strategy';
import { PayloadValidator } from '../../../application/payload-validator/payload-validator.abstract';
import { TokenPayload } from '../../../domain/types/token-payload.type';
import { User } from '../../../../users/domain/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { JwtConfigGetter } from '../../../../core/config/configs/jwt';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let payloadValidator: PayloadValidator;

  const mockPayloadValidator = {
    validatePayload: jest.fn(),
  };

  const mockConfigGetter = {
    get: jest.fn().mockReturnValue({ secret: 'test-secret' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: JwtConfigGetter,
          useValue: mockConfigGetter,
        },
        {
          provide: PayloadValidator,
          useValue: mockPayloadValidator,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    payloadValidator = module.get<PayloadValidator>(PayloadValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when payload is valid', async () => {
      const uuid = randomUUID();
      const tokenPayload: TokenPayload = { sub: uuid, role: UserRole.PATIENT };
      const expectedUser = User.fromPersistence(
        createUserPersistence({
          id: uuid,
        }),
      );
      (payloadValidator.validatePayload as jest.Mock).mockResolvedValue(
        expectedUser,
      );

      const result = await strategy.validate(tokenPayload);

      expect(payloadValidator.validatePayload).toHaveBeenCalledWith(
        tokenPayload,
      );
      expect(result).toEqual(expectedUser);
    });

    it('should throw an error when payload validation fails', async () => {
      const tokenPayload: TokenPayload = {
        sub: randomUUID(),
        role: UserRole.DOCTOR,
      };
      const error = new UnauthorizedException('Invalid user');
      (payloadValidator.validatePayload as jest.Mock).mockRejectedValue(error);

      await expect(strategy.validate(tokenPayload)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(payloadValidator.validatePayload).toHaveBeenCalledWith(
        tokenPayload,
      );
    });
  });
});
