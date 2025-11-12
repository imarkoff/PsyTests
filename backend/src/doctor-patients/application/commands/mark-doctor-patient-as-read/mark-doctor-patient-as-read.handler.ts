import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkDoctorPatientAsReadCommand } from './mark-doctor-patient-as-read.command';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';

@CommandHandler(MarkDoctorPatientAsReadCommand)
export class MarkDoctorPatientAsReadHandler
  implements ICommandHandler<MarkDoctorPatientAsReadCommand>
{
  private readonly logger = new Logger(MarkDoctorPatientAsReadHandler.name);

  constructor(
    private readonly doctorPatientsRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    patientId,
  }: MarkDoctorPatientAsReadCommand): Promise<void> {
    this.logger.debug(
      `Marking doctor-patient relationship as read 
      for doctorId: ${doctorId} and patientId: ${patientId}`,
    );

    const doctorPatient =
      await this.doctorPatientsRepository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

    if (!doctorPatient) {
      throw new DoctorPatientNotFoundException(doctorId, patientId);
    }

    await this.doctorPatientsRepository.changeNeedsAttentionStatus(
      doctorPatient,
      false,
    );

    this.logger.debug(
      `Successfully marked doctor-patient relationship as read 
      for doctorId: ${doctorId} and patientId: ${patientId}`,
    );
  }
}
