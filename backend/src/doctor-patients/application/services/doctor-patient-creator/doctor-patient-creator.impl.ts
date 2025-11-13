import { UUID } from 'node:crypto';
import { PatientCreateDto } from 'src/doctor-patients/presentation/dtos/patient-create.dto';
import { DoctorPatientCreator } from './doctor-patient-creator.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../../../users/application/commands/create-user/create-user.command';
import { AssignDoctorPatientCommand } from '../../commands/assign-doctor-patient/assign-doctor-patient.command';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

@Injectable()
export class DoctorPatientCreatorImpl implements DoctorPatientCreator {
  private readonly logger = new Logger(DoctorPatientCreatorImpl.name);

  constructor(private readonly commandBus: CommandBus) {}

  async createDoctorPatient(
    doctorId: UUID,
    patientCreate: PatientCreateDto,
  ): Promise<DoctorPatientDto> {
    this.logger.debug(`Creating patient for doctor with ID: ${doctorId}.`);

    const userCreate = patientCreate.toUserCreateDto();

    const createdUser = await this.commandBus.execute(
      new CreateUserCommand(userCreate, doctorId),
    );

    this.logger.debug(
      `Created user with ID: ${createdUser.id}. Assigning to doctor.`,
    );

    const doctorPatient = this.commandBus.execute(
      new AssignDoctorPatientCommand(doctorId, createdUser.id),
    );

    this.logger.debug(
      `Assigned patient with ID: ${createdUser.id} to doctor with ID: ${doctorId}.`,
    );

    return doctorPatient;
  }
}
