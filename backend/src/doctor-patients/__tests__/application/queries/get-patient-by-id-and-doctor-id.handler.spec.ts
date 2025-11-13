import { GetPatientByIdAndDoctorIdHandler } from '../../../application/queries/get-patient-by-id-and-doctor-id/get-patient-by-id-and-doctor-id.handler';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { GetPatientByIdAndDoctorIdQuery } from '../../../application/queries/get-patient-by-id-and-doctor-id/get-patient-by-id-and-doctor-id.query';
import { randomUUID } from 'node:crypto';

describe(GetPatientByIdAndDoctorIdHandler.name, () => {
  let handler: GetPatientByIdAndDoctorIdHandler;

  const repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getPatientByDoctorAndPatientId' | 'getAssignedPatientByDoctorAndPatientId'
  > = {
    getPatientByDoctorAndPatientId: jest.fn(),
    getAssignedPatientByDoctorAndPatientId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetPatientByIdAndDoctorIdHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(GetPatientByIdAndDoctorIdHandler);
  });

  it('should return dto when patient is found', async () => {
    const doctorPatient = createDoctorPatientFixture();
    const expectedDto = DoctorPatientMapper.toDto(doctorPatient);
    repository.getPatientByDoctorAndPatientId.mockResolvedValue(doctorPatient);

    const result = await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as GetPatientByIdAndDoctorIdQuery);

    expect(result).toEqual(expectedDto);
  });

  it('should return null when patient is not found', async () => {
    repository.getPatientByDoctorAndPatientId.mockResolvedValue(null);

    const result = await handler.execute({
      doctorId: randomUUID(),
      patientId: randomUUID(),
    } as GetPatientByIdAndDoctorIdQuery);

    expect(result).toBeNull();
  });

  it('should call repository with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();
    repository.getPatientByDoctorAndPatientId.mockResolvedValue(null);

    await handler.execute({
      doctorId,
      patientId,
    } as GetPatientByIdAndDoctorIdQuery);

    expect(repository.getPatientByDoctorAndPatientId).toHaveBeenCalledWith(
      doctorId,
      patientId,
    );
  });

  it('should not call getAssignedPatientByDoctorAndPatientId method', async () => {
    repository.getPatientByDoctorAndPatientId.mockResolvedValue(null);

    await handler.execute({
      doctorId: randomUUID(),
      patientId: randomUUID(),
    } as GetPatientByIdAndDoctorIdQuery);

    expect(
      repository.getAssignedPatientByDoctorAndPatientId,
    ).not.toHaveBeenCalled();
  });
});
