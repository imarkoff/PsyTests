import { UUID } from 'crypto';
import { DoctorPatient } from 'src/doctor-patients/domain/entities/doctor-patient.entity';
import { DoctorPatientDto } from 'src/doctor-patients/presentation/dtos/doctor-patient.dto';
import { PatientCreateDto } from 'src/doctor-patients/presentation/dtos/patient-create.dto';
import { UserWithDoctorPatientInfoDto } from 'src/doctor-patients/presentation/dtos/user-with-doctor-patient-info.dto';
import { PaginatedList } from 'src/shared/pagination/domain/types/paginated-list.type';
import { PaginationParams } from 'src/shared/pagination/domain/types/pagination-params.type';
import { DoctorPatientOrchestrator } from './doctor-patient-orchestrator.abstract';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DoctorPatientCreator } from '../doctor-patient-creator/doctor-patient-creator.abstract';
import { DoctorPatientRemover } from '../doctor-patient-remover/doctor-patient-remover.abstract';
import { PatientsFinder } from '../patients-finder/patients-finder.abstract';
import { GetPatientsByDoctorIdQuery } from '../../queries/get-patients-by-doctor-id/get-patients-by-doctor-id.query';
import { GetPatientByIdAndDoctorIdQuery } from '../../queries/get-patient-by-id-and-doctor-id/get-patient-by-id-and-doctor-id.query';
import { AssignDoctorPatientCommand } from '../../commands/assign-doctor-patient/assign-doctor-patient.command';
import { MarkDoctorPatientAsReadCommand } from '../../commands/mark-doctor-patient-as-read/mark-doctor-patient-as-read.command';
import { User } from '../../../../users/domain/entities/user.entity';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';

@Injectable()
export class DoctorPatientOrchestratorImpl
  implements DoctorPatientOrchestrator
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly doctorPatientCreator: DoctorPatientCreator,
    private readonly doctorPatientRemover: DoctorPatientRemover,
    private readonly patientsFinder: PatientsFinder,
  ) {}

  getActivePatientsByDoctor(
    doctorId: UUID,
    paginationParams: PaginationParams<DoctorPatient>,
  ): Promise<PaginatedList<DoctorPatientDto, DoctorPatient>> {
    return this.queryBus.execute(
      new GetPatientsByDoctorIdQuery(doctorId, paginationParams),
    );
  }

  async getDoctorPatientByDoctorAndPatientIds(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatientDto> {
    const doctorPatient = await this.queryBus.execute(
      new GetPatientByIdAndDoctorIdQuery(doctorId, patientId),
    );

    if (!doctorPatient) {
      throw new DoctorPatientNotFoundException(doctorId, patientId);
    }

    return doctorPatient;
  }

  findPatients(
    doctorId: UUID,
    paginationParams: PaginationParams<User>,
  ): Promise<PaginatedList<UserWithDoctorPatientInfoDto, User>> {
    return this.patientsFinder.find(doctorId, paginationParams);
  }

  createNewPatientAndAssignToDoctor(
    doctorId: UUID,
    patientCreate: PatientCreateDto,
  ): Promise<DoctorPatientDto> {
    return this.doctorPatientCreator.createDoctorPatient(
      doctorId,
      patientCreate,
    );
  }

  assignExistingPatientToDoctor(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatientDto> {
    return this.commandBus.execute(
      new AssignDoctorPatientCommand(doctorId, patientId),
    );
  }

  markDoctorPatientAsRead(doctorId: UUID, patientId: UUID): Promise<void> {
    return this.commandBus.execute(
      new MarkDoctorPatientAsReadCommand(doctorId, patientId),
    );
  }

  unassignPatientFromDoctor(doctorId: UUID, patientId: UUID): Promise<void> {
    return this.doctorPatientRemover.remove(doctorId, patientId);
  }
}
