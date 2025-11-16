import { CreateUserHandler } from '../../../application/commands/create-user/create-user.handler';
import { PhoneIsAlreadyTakenException } from '../../../domain/exceptions/phone-is-already-taken.exception';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { Test } from '@nestjs/testing';
import { createUserCreateDtoFixture } from '../../fixtures/user-create-dto.fixture';
import { CreateUserCommand } from '../../../application/commands/create-user/create-user.command';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { randomUUID } from 'node:crypto';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';
import { ForbiddenToRegisterUserException } from '../../../domain/exceptions/forbidden-to-register-user.exception';
import { createUserFixture } from '../../fixtures/user.fixture';

describe(CreateUserHandler.name, () => {
  let handler: CreateUserHandler;
  const userRepository: Pick<
    jest.Mocked<UserRepository>,
    'getUserByPhone' | 'getUserById' | 'createUser'
  > = {
    getUserByPhone: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
  };
  const passwordService: Pick<jest.Mocked<PasswordService>, 'hashPassword'> = {
    hashPassword: jest.fn().mockResolvedValue({
      hash: Buffer.from('hashed-password'),
      salt: Buffer.from('salt'),
    }),
  };
  const roleValidator: Pick<jest.Mocked<RoleValidator>, 'isDoctorOrAdmin'> = {
    isDoctorOrAdmin: jest
      .fn()
      .mockImplementation(
        (role: UserRole) => role === UserRole.DOCTOR || role === UserRole.ADMIN,
      ),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: PasswordService,
          useValue: passwordService,
        },
        {
          provide: RoleValidator,
          useValue: roleValidator,
        },
      ],
    }).compile();

    handler = module.get(CreateUserHandler);
  });

  it('creates a new user when phone is unique and no registering user provided', async () => {
    const userCreateDto = createUserCreateDtoFixture();
    userRepository.getUserByPhone.mockResolvedValue(null);
    userRepository.createUser.mockImplementation((user) =>
      Promise.resolve(user),
    );

    const result = await handler.execute({
      userCreateDto,
      registeredById: undefined,
    } as CreateUserCommand);

    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(
      userCreateDto.phone,
    );
    expect(roleValidator.isDoctorOrAdmin).not.toHaveBeenCalled();
    expect(userRepository.getUserById).not.toHaveBeenCalled();
    expect(passwordService.hashPassword).toHaveBeenCalledWith(
      userCreateDto.password,
    );
    expect(userRepository.createUser).toHaveBeenCalled();
    expect(result.phone).toBe(userCreateDto.phone);
  });

  it('throws PhoneIsAlreadyTakenException when phone is already registered', async () => {
    const userCreateDto = createUserCreateDtoFixture();
    const existingUser = createUserFixture();
    userRepository.getUserByPhone.mockResolvedValue(existingUser);

    await expect(
      handler.execute({
        userCreateDto,
        registeredById: undefined,
      } as CreateUserCommand),
    ).rejects.toBeInstanceOf(PhoneIsAlreadyTakenException);

    expect(userRepository.getUserByPhone).toHaveBeenCalledWith(
      userCreateDto.phone,
    );
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.createUser).not.toHaveBeenCalled();
  });

  it('throws UserNotFoundException when registering user does not exist', async () => {
    const userCreateDto = createUserCreateDtoFixture();
    const nonExistentUserId = randomUUID();
    userRepository.getUserByPhone.mockResolvedValue(null);
    userRepository.getUserById.mockResolvedValue(null);

    await expect(
      handler.execute({
        userCreateDto,
        registeredById: nonExistentUserId,
      } as CreateUserCommand),
    ).rejects.toBeInstanceOf(UserNotFoundException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(nonExistentUserId);
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.createUser).not.toHaveBeenCalled();
  });

  it.each([UserRole.ADMIN, UserRole.DOCTOR])(
    'creates a new user when registered by a %s',
    async (role) => {
      const userCreateDto = createUserCreateDtoFixture();
      const registeringUser = createUserFixture({ role });
      userRepository.getUserById.mockResolvedValue(registeringUser);
      userRepository.createUser.mockImplementation((user) =>
        Promise.resolve(user),
      );

      const result = await handler.execute({
        userCreateDto,
        registeredById: registeringUser.id,
      } as CreateUserCommand);

      expect(userRepository.getUserById).toHaveBeenCalledWith(
        registeringUser.id,
      );
      expect(roleValidator.isDoctorOrAdmin).toHaveBeenCalledWith(role);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        userCreateDto.password,
      );
      expect(userRepository.createUser).toHaveBeenCalled();
      expect(result.phone).toBe(userCreateDto.phone);
    },
  );

  it('throws ForbiddenToRegisterUserException when registering user lacks privileges', async () => {
    const userCreateDto = createUserCreateDtoFixture();
    const registeringUser = createUserFixture({ role: UserRole.PATIENT });
    userRepository.getUserById.mockResolvedValue(registeringUser);

    await expect(
      handler.execute({
        userCreateDto,
        registeredById: registeringUser.id,
      } as CreateUserCommand),
    ).rejects.toBeInstanceOf(ForbiddenToRegisterUserException);

    expect(userRepository.getUserById).toHaveBeenCalledWith(registeringUser.id);
    expect(roleValidator.isDoctorOrAdmin).toHaveBeenCalledWith(
      UserRole.PATIENT,
    );
    expect(passwordService.hashPassword).not.toHaveBeenCalled();
    expect(userRepository.createUser).not.toHaveBeenCalled();
  });
});
