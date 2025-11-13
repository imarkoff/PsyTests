import { GetDoctorPatientsByDoctorIdAndPatientIdsHandler } from '../../../application/queries/get-doctor-patients-by-doctor-id-and-patient-ids/get-doctor-patients-by-doctor-id-and-patient-ids.handler';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { randomUUID } from 'node:crypto';
import { GetDoctorPatientsByDoctorIdAndPatientIdsQuery } from '../../../application/queries/get-doctor-patients-by-doctor-id-and-patient-ids/get-doctor-patients-by-doctor-id-and-patient-ids.query';

describe(GetDoctorPatientsByDoctorIdAndPatientIdsHandler.name, () => {
  let handler: GetDoctorPatientsByDoctorIdAndPatientIdsHandler;

  const repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getPatientsByDoctorAndPatientsIds'
  > = {
    getPatientsByDoctorAndPatientsIds: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetDoctorPatientsByDoctorIdAndPatientIdsHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(GetDoctorPatientsByDoctorIdAndPatientIdsHandler);
  });

  it('should call repository with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientIds = [randomUUID(), randomUUID()];
    repository.getPatientsByDoctorAndPatientsIds.mockResolvedValue([]);

    await handler.execute({
      doctorId,
      patientIds,
    } as GetDoctorPatientsByDoctorIdAndPatientIdsQuery);

    expect(repository.getPatientsByDoctorAndPatientsIds).toHaveBeenCalledWith(
      doctorId,
      patientIds,
    );
  });

  it('should return doctor patients dtos', async () => {
    const doctorId = randomUUID();
    const patientIds = [randomUUID(), randomUUID()];
    const doctorPatients = patientIds.map((patientId) =>
      createDoctorPatientFixture({
        doctorId,
        patientId,
      }),
    );
    const expectedDtos = doctorPatients.map((dp) =>
      DoctorPatientMapper.toDto(dp),
    );
    repository.getPatientsByDoctorAndPatientsIds.mockResolvedValue(
      doctorPatients,
    );

    const result = await handler.execute({
      doctorId,
      patientIds,
    } as GetDoctorPatientsByDoctorIdAndPatientIdsQuery);

    expect(result).toEqual(expectedDtos);
  });

  it('should return empty array if no doctor patients found', async () => {
    const doctorId = randomUUID();
    const patientIds = [randomUUID(), randomUUID()];
    repository.getPatientsByDoctorAndPatientsIds.mockResolvedValue([]);

    const result = await handler.execute({
      doctorId,
      patientIds,
    } as GetDoctorPatientsByDoctorIdAndPatientIdsQuery);

    expect(result).toEqual([]);
  });
});
