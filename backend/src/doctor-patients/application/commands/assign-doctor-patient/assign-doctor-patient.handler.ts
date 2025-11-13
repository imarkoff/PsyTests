import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AssignDoctorPatientCommand } from './assign-doctor-patient.command';
import { DoctorPatient } from 'src/doctor-patients/domain/entities/doctor-patient.entity';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { DoctorPatientAlreadyExistsException } from '../../../domain/exceptions/doctor-patient-already-exists.exception';
import { Logger } from '@nestjs/common';
import { DoctorPatientMapper } from '../../mappers/doctor-patient.mapper';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

@CommandHandler(AssignDoctorPatientCommand)
export class AssignDoctorPatientHandler
  implements ICommandHandler<AssignDoctorPatientCommand>
{
  private readonly logger = new Logger(AssignDoctorPatientHandler.name);

  constructor(
    private readonly doctorPatientRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    patientId,
  }: AssignDoctorPatientCommand): Promise<DoctorPatientDto> {
    this.logger.debug(
      `Assigning patient with ID: ${patientId} to doctor with ID: ${doctorId}.`,
    );

    const existingDoctorPatient =
      await this.doctorPatientRepository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

    if (existingDoctorPatient) {
      this.logger.warn(
        `Patient with ID: ${patientId} is already assigned to doctor with ID: ${doctorId}.`,
      );
      throw new DoctorPatientAlreadyExistsException(doctorId, patientId);
    }

    const newDoctorPatient = DoctorPatient.create(doctorId, patientId);

    const createdDoctorPatient =
      await this.doctorPatientRepository.createDoctorPatient(newDoctorPatient);

    this.logger.debug(
      `Assigned patient with ID: ${patientId} to doctor with ID: ${doctorId}.`,
    );

    return DoctorPatientMapper.toDto(createdDoctorPatient);
  }
}
