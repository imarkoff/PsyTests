import { MarkDoctorPatientAsReadHandler } from '../../../application/commands/mark-doctor-patient-as-read/mark-doctor-patient-as-read.handler';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { MarkDoctorPatientAsReadCommand } from '../../../application/commands/mark-doctor-patient-as-read/mark-doctor-patient-as-read.command';
import { randomUUID } from 'node:crypto';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';

describe(MarkDoctorPatientAsReadHandler.name, () => {
  let handler: MarkDoctorPatientAsReadHandler;

  const repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getAssignedPatientByDoctorAndPatientId' | 'changeNeedsAttentionStatus'
  > = {
    getAssignedPatientByDoctorAndPatientId: jest.fn(),
    changeNeedsAttentionStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        MarkDoctorPatientAsReadHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(MarkDoctorPatientAsReadHandler);
  });

  it('should return void on successful marking as read', async () => {
    const doctorPatient = createDoctorPatientFixture();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    const result = await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as MarkDoctorPatientAsReadCommand);

    expect(result).toBeUndefined();
  });

  it('should call getAssignedPatientByDoctorAndPatientId with correct parameters', async () => {
    const doctorPatient = createDoctorPatientFixture();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as MarkDoctorPatientAsReadCommand);

    expect(
      repository.getAssignedPatientByDoctorAndPatientId,
    ).toHaveBeenCalledWith(doctorPatient.doctorId, doctorPatient.patientId);
  });

  it('should call changeNeedsAttentionStatus with correct parameters', async () => {
    const doctorPatient = createDoctorPatientFixture();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as MarkDoctorPatientAsReadCommand);

    expect(repository.changeNeedsAttentionStatus).toHaveBeenCalledWith(
      doctorPatient,
      false,
    );
  });

  it('should throw DoctorPatientNotFoundException when doctor-patient relationship does not exist', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      null,
    );

    await expect(
      handler.execute({
        doctorId,
        patientId,
      } as MarkDoctorPatientAsReadCommand),
    ).rejects.toThrow(DoctorPatientNotFoundException);
  });
});
