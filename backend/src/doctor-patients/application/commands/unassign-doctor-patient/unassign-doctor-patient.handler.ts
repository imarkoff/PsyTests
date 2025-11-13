import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnassignDoctorPatientCommand } from './unassign-doctor-patient.command';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';

@CommandHandler(UnassignDoctorPatientCommand)
export class UnassignDoctorPatientHandler
  implements ICommandHandler<UnassignDoctorPatientCommand>
{
  private readonly logger = new Logger(UnassignDoctorPatientHandler.name);

  constructor(
    private readonly doctorPatientsRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    patientId,
  }: UnassignDoctorPatientCommand): Promise<void> {
    this.logger.debug(
      `Unassigning doctor (ID: ${doctorId}) from patient (ID: ${patientId})`,
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

    await this.doctorPatientsRepository.changeAssignedStatus(
      doctorPatient,
      false,
    );

    this.logger.debug(
      `Successfully unassigned doctor (ID: ${doctorId}) from patient (ID: ${patientId})`,
    );
  }
}
