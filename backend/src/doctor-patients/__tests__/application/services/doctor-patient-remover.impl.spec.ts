import { DoctorPatientRemoverImpl } from '../../../application/services/doctor-patient-remover/doctor-patient-remover.impl';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { UnassignDoctorPatientCommand } from '../../../application/commands/unassign-doctor-patient/unassign-doctor-patient.command';

describe(DoctorPatientRemoverImpl.name, () => {
  let service: DoctorPatientRemoverImpl;

  const commandBus: Pick<jest.Mocked<CommandBus>, 'execute'> = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        DoctorPatientRemoverImpl,
        {
          provide: CommandBus,
          useValue: commandBus,
        },
      ],
    }).compile();

    service = module.get(DoctorPatientRemoverImpl);
  });

  it('should return void on successful removal', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();

    const result = await service.remove(doctorId, patientId);

    expect(result).toBeUndefined();
    expect(commandBus.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw error when command bus fails', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();
    const error = new Error('Command bus error');
    commandBus.execute.mockRejectedValueOnce(error);

    await expect(service.remove(doctorId, patientId)).rejects.toThrow(error);
  });

  it('should call UnassignDoctorPatientCommand with correct parameters', async () => {
    const doctorId = randomUUID();
    const patientId = randomUUID();

    await service.remove(doctorId, patientId);

    expect(commandBus.execute).toHaveBeenCalledWith({
      doctorId,
      patientId,
    } as UnassignDoctorPatientCommand);
  });
});
