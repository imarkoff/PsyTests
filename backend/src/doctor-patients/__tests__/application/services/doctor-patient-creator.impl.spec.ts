import { DoctorPatientCreatorImpl } from '../../../application/services/doctor-patient-creator/doctor-patient-creator.impl';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { createPatientCreateFixture } from '../../fixtures/patient-create.fixture';
import { UserMapper } from '../../../../users/application/mappers/user.mapper';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { PhoneIsAlreadyTakenException } from '../../../../users/domain/exceptions/phone-is-already-taken.exception';
import { CreateUserCommand } from '../../../../users/application/commands/create-user/create-user.command';
import { AssignDoctorPatientCommand } from '../../../application/commands/assign-doctor-patient/assign-doctor-patient.command';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';

describe(DoctorPatientCreatorImpl.name, () => {
  let service: DoctorPatientCreatorImpl;

  const commandBus: Pick<jest.Mocked<CommandBus>, 'execute'> = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        DoctorPatientCreatorImpl,
        {
          provide: CommandBus,
          useValue: commandBus,
        },
      ],
    }).compile();

    service = module.get(DoctorPatientCreatorImpl);
  });

  it('should return doctor patient dto if successful', async () => {
    const doctorId = randomUUID();
    const patientCreateDto = createPatientCreateFixture();
    const createdUser = UserMapper.toDto(
      createUserFixture({ registeredById: doctorId }),
    );
    const expectedDoctorPatientDto = DoctorPatientMapper.toDto(
      DoctorPatientMapper.createNewRelation(doctorId, createdUser.id),
    );
    commandBus.execute
      .mockResolvedValueOnce(createdUser)
      .mockResolvedValueOnce(expectedDoctorPatientDto);

    const result = await service.createDoctorPatient(
      doctorId,
      patientCreateDto,
    );

    expect(result).toEqual(expectedDoctorPatientDto);
  });

  it('should throw an error if command bus fails', async () => {
    const doctorId = randomUUID();
    const patientCreateDto = createPatientCreateFixture();
    const error = new PhoneIsAlreadyTakenException(patientCreateDto.phone);
    commandBus.execute.mockRejectedValueOnce(error);

    await expect(
      service.createDoctorPatient(doctorId, patientCreateDto),
    ).rejects.toThrow(error);
  });

  it('should call CreateUserCommand with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientCreateDto = createPatientCreateFixture();
    const expectedUserCreateDto = patientCreateDto.toUserCreateDto();
    commandBus.execute
      .mockResolvedValueOnce(Object)
      .mockResolvedValueOnce(Object);

    await service.createDoctorPatient(doctorId, patientCreateDto);

    const firstCall = commandBus.execute.mock.calls[0][0];
    expect(firstCall).toBeInstanceOf(CreateUserCommand);
    expect(firstCall).toMatchObject({
      userCreateDto: expectedUserCreateDto,
      registeredById: doctorId,
    } as CreateUserCommand);
  });

  it('should call AssignDoctorPatientCommand with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientCreateDto = createPatientCreateFixture();
    const createdUser = UserMapper.toDto(
      createUserFixture({ registeredById: doctorId }),
    );
    commandBus.execute
      .mockResolvedValueOnce(createdUser)
      .mockResolvedValueOnce(Object);

    await service.createDoctorPatient(doctorId, patientCreateDto);

    const secondCall = commandBus.execute.mock.calls[1][0];
    expect(secondCall).toBeInstanceOf(AssignDoctorPatientCommand);
    expect(secondCall).toMatchObject({
      doctorId,
      patientId: createdUser.id,
    });
  });
});
