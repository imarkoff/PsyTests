import { GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler } from '../../../application/queries/get-assigned-doctor-patient-by-doctor-id-and-patient-id/get-assigned-doctor-patient-by-doctor-id-and-patient-id.handler';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery } from '../../../application/queries/get-assigned-doctor-patient-by-doctor-id-and-patient-id/get-assigned-doctor-patient-by-doctor-id-and-patient-id.query';
import { randomUUID } from 'node:crypto';

describe(GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler.name, () => {
  let handler: GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler;

  let repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getAssignedPatientByDoctorAndPatientId'
  >;

  const doctorPatient = createDoctorPatientFixture();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: <typeof repository>{
            getAssignedPatientByDoctorAndPatientId: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(GetAssignedDoctorPatientByDoctorIdAndPatientIdHandler);
    repository = module.get(DoctorPatientsRepository);
  });

  it('should return correct doctor-patient dto when found', async () => {
    const expectedDto = DoctorPatientMapper.toDto(doctorPatient);
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValue(
      doctorPatient,
    );

    const result = await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery);

    expect(result).toEqual(expectedDto);
  });

  it('should return null when no doctor-patient relation found', async () => {
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValue(null);

    const result = await handler.execute({
      doctorId: randomUUID(),
      patientId: randomUUID(),
    } as GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery);

    expect(result).toBeNull();
  });

  it('should call repository with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();

    await handler.execute({
      doctorId,
      patientId,
    } as GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery);

    expect(
      repository.getAssignedPatientByDoctorAndPatientId,
    ).toHaveBeenCalledWith(doctorId, patientId);
  });
});
