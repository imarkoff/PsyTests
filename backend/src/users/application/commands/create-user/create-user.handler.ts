import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { User } from '../../../domain/entities/user.entity';
import { UserRepository } from '../../../domain/interfaces/user.repository.interface';
import { PasswordService } from '../../../../core/auth/password/password.interface';
import { UserDto } from '../../../presentation/dtos/user.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { PhoneIsAlreadyTakenException } from '../../../domain/exceptions/phone-is-already-taken.exception';
import { UUID } from 'crypto';
import { RoleValidator } from '../../../../core/validations/role-validator/role-validator.interface';
import { Logger } from '@nestjs/common';
import { ForbiddenToRegisterUserException } from '../../../domain/exceptions/forbidden-to-register-user.exception';
import { UserNotFoundException } from '../../../domain/exceptions/user-not-found.exception';

/**
 * Command handler responsible for creating a new user.
 * It checks for phone number uniqueness
 * and hashes the password before creating the user.
 */
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  private readonly logger = new Logger(CreateUserHandler.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly roleValidator: RoleValidator,
  ) {}

  /**
   * Create a new user after checking for phone uniqueness and hashing the password.
   * @param userCreateDto - Data Transfer Object containing user creation details.
   * @param registeredById - Optional ID of the user who is registering the new user. Should exist and not be a patient.
   * @returns A Promise that resolves to the created UserDto.
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use.
   * @throws UserNotFoundException if the registering user does not exist.
   * @throws ForbiddenToRegisterUserException if the registering user does not have sufficient privileges.
   */
  async execute({
    userCreateDto,
    registeredById,
  }: CreateUserCommand): Promise<UserDto> {
    this.logger.debug(
      `Executing CreateUserCommand for phone: ${userCreateDto.phone}. 
      Registered by: ${registeredById ?? 'self'}`,
    );

    await this.checkPhoneUnique(userCreateDto.phone);
    await this.checkRegisteredByCanRegister(registeredById);

    const hashedPassword = await this.passwordService.hashPassword(
      userCreateDto.password,
    );

    const user = UserMapper.fromCreateDto(
      userCreateDto,
      hashedPassword,
      registeredById,
    );
    const createdUser = await this.userRepository.createUser(user);

    this.logger.log(`User created with ID: ${createdUser.id}`);
    return UserMapper.toDto(createdUser);
  }

  private async checkPhoneUnique(phone: string): Promise<void> {
    const existingUser = await this.userRepository.getUserByPhone(phone);
    if (existingUser) {
      this.logger.warn(`Phone number already taken: ${phone}`);
      throw new PhoneIsAlreadyTakenException(phone);
    }
  }

  private async checkRegisteredByCanRegister(registeredById: UUID | undefined) {
    if (!registeredById) {
      this.logger.debug(
        `No registeredById provided. Proceeding with self-registration.`,
      );
      return;
    }

    this.logger.debug(
      `Registered by ID provided: ${registeredById}. Validating registering user.`,
    );

    const registeringUser =
      await this.userRepository.getUserById(registeredById);

    if (!registeringUser) {
      this.logger.warn(`Registering user with ID ${registeredById} not found.`);
      throw new UserNotFoundException(registeredById);
    }

    this.checkRegisteredByIsDoctorOrAdmin(registeringUser);
  }

  private checkRegisteredByIsDoctorOrAdmin(registeringUser: User) {
    if (this.roleValidator.isDoctorOrAdmin(registeringUser.role)) return;

    this.logger.warn(
      `Registering user with ID ${registeringUser.id} does not have sufficient privileges.`,
    );
    throw new ForbiddenToRegisterUserException();
  }
}
