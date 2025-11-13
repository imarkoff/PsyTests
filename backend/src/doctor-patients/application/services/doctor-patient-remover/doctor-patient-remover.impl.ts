import { UUID } from 'crypto';
import { DoctorPatientRemover } from './doctor-patient-remover.abstract';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UnassignDoctorPatientCommand } from '../../commands/unassign-doctor-patient/unassign-doctor-patient.command';

@Injectable()
export class DoctorPatientRemoverImpl implements DoctorPatientRemover {
  private readonly logger = new Logger(DoctorPatientRemoverImpl.name);

  constructor(private readonly commandBus: CommandBus) {}

  async remove(doctorId: UUID, patientId: UUID): Promise<void> {
    this.logger.debug(
      `Removing patient ${patientId} from doctor ${doctorId}'s list`,
    );

    // TODO: Remove assigned tests, appointments, and other related data

    await this.commandBus.execute(
      new UnassignDoctorPatientCommand(doctorId, patientId),
    );

    this.logger.debug(
      `Successfully removed patient ${patientId} from doctor ${doctorId}'s list`,
    );
  }
}
