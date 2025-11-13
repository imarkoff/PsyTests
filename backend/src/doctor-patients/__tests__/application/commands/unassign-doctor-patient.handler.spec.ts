import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { randomUUID } from 'node:crypto';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';
import { UnassignDoctorPatientHandler } from '../../../application/commands/unassign-doctor-patient/unassign-doctor-patient.handler';
import { UnassignDoctorPatientCommand } from '../../../application/commands/unassign-doctor-patient/unassign-doctor-patient.command';

describe(UnassignDoctorPatientHandler.name, () => {
  let handler: UnassignDoctorPatientHandler;

  const repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    | 'getAssignedPatientByDoctorAndPatientId'
    | 'changeNeedsAttentionStatus'
    | 'changeAssignedStatus'
  > = {
    getAssignedPatientByDoctorAndPatientId: jest.fn(),
    changeNeedsAttentionStatus: jest.fn(),
    changeAssignedStatus: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        UnassignDoctorPatientHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(UnassignDoctorPatientHandler);
  });

  it('should return void on successful unassignment', async () => {
    const doctorPatient = createDoctorPatientFixture();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    const result = await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as UnassignDoctorPatientCommand);

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
    } as UnassignDoctorPatientCommand);

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
    } as UnassignDoctorPatientCommand);

    expect(repository.changeNeedsAttentionStatus).toHaveBeenCalledWith(
      doctorPatient,
      false,
    );
  });

  it('should call changeAssignedStatus with correct parameters', async () => {
    const doctorPatient = createDoctorPatientFixture();
    repository.getAssignedPatientByDoctorAndPatientId.mockResolvedValueOnce(
      doctorPatient,
    );

    await handler.execute({
      doctorId: doctorPatient.doctorId,
      patientId: doctorPatient.patientId,
    } as UnassignDoctorPatientCommand);

    expect(repository.changeAssignedStatus).toHaveBeenCalledWith(
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
      } as UnassignDoctorPatientCommand),
    ).rejects.toThrow(DoctorPatientNotFoundException);
  });
});
