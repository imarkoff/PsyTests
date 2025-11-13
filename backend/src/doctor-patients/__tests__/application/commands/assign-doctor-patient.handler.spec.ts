import { AssignDoctorPatientHandler } from '../../../application/commands/assign-doctor-patient/assign-doctor-patient.handler';
import { Test } from '@nestjs/testing';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { AssignDoctorPatientCommand } from '../../../application/commands/assign-doctor-patient/assign-doctor-patient.command';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { DoctorPatientAlreadyExistsException } from '../../../domain/exceptions/doctor-patient-already-exists.exception';

describe(AssignDoctorPatientHandler.name, () => {
  let assignDoctorPatientHandler: AssignDoctorPatientHandler;

  const mockedDoctorPatientsRepository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getAssignedPatientByDoctorAndPatientId' | 'createDoctorPatient'
  > = {
    createDoctorPatient: jest.fn(),
    getAssignedPatientByDoctorAndPatientId: jest
      .fn()
      .mockImplementation((doctorPatient: DoctorPatient) => doctorPatient),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        AssignDoctorPatientHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: mockedDoctorPatientsRepository,
        },
      ],
    }).compile();

    assignDoctorPatientHandler = module.get(AssignDoctorPatientHandler);
  });

  it('should return dto on successful assignment', async () => {
    const doctorPatient = createDoctorPatientFixture();
    const expectedDto = DoctorPatientMapper.toDto(doctorPatient);
    mockedDoctorPatientsRepository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      null,
    );
    mockedDoctorPatientsRepository.createDoctorPatient.mockResolvedValueOnce(
      doctorPatient,
    );

    const result = await assignDoctorPatientHandler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as AssignDoctorPatientCommand);

    expect(result).toEqual(expectedDto);
    expect(
      mockedDoctorPatientsRepository.getAssignedPatientByDoctorAndPatientId,
    ).toHaveBeenCalledWith(doctorPatient.doctorId, doctorPatient.patientId);
  });

  it('should call createDoctorPatient with a DoctorPatient instance', async () => {
    const doctorPatient = createDoctorPatientFixture();
    mockedDoctorPatientsRepository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      null,
    );
    mockedDoctorPatientsRepository.createDoctorPatient.mockResolvedValueOnce(
      doctorPatient,
    );

    await assignDoctorPatientHandler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as AssignDoctorPatientCommand);

    const createDoctorPatientArg =
      mockedDoctorPatientsRepository.createDoctorPatient.mock.calls[0][0];
    expect(createDoctorPatientArg).toBeInstanceOf(DoctorPatient);
  });

  it('should throw DoctorPatientAlreadyExistsException if assignment already exists', async () => {
    const doctorPatient = createDoctorPatientFixture();
    mockedDoctorPatientsRepository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    await expect(
      assignDoctorPatientHandler.execute({
        doctorId: doctorPatient.doctorId,
        patientId: doctorPatient.patientId,
      } as AssignDoctorPatientCommand),
    ).rejects.toThrow(DoctorPatientAlreadyExistsException);
  });
});
