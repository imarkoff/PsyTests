import { UUID } from 'node:crypto';
import { UserWithDoctorPatientInfoDto } from '../../../presentation/dtos/user-with-doctor-patient-info.dto';
import { PatientsFinder } from './patients-finder.abstract';
import { QueryBus } from '@nestjs/cqrs';
import { Injectable, Logger } from '@nestjs/common';
import { GetPaginatedUsersByRoleQuery } from '../../../../users/application/queries/get-paginated-users-by-role/get-paginated-users-by-role.query';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { PaginatedList } from 'src/shared/pagination/domain/types/paginated-list.type';
import { PaginationParams } from 'src/shared/pagination/domain/types/pagination-params.type';
import { User } from 'src/users/domain/entities/user.entity';
import { GetDoctorPatientsByDoctorIdAndPatientIdsQuery } from '../../queries/get-doctor-patients-by-doctor-id-and-patient-ids/get-doctor-patients-by-doctor-id-and-patient-ids.query';
import { UserWithDoctorPatientInfoMapper } from '../../mappers/user-with-doctor-patient-info.mapper';

@Injectable()
export class PatientsFinderImpl extends PatientsFinder {
  private readonly logger = new Logger(PatientsFinderImpl.name);

  constructor(private readonly queryBus: QueryBus) {
    super();
  }

  async find(
    doctorId: UUID,
    paginationParams: PaginationParams<User>,
  ): Promise<PaginatedList<UserWithDoctorPatientInfoDto, User>> {
    this.logger.debug(`Finding patients for doctor with ID: ${doctorId}`);

    const paginatedPatients = await this.queryBus.execute(
      new GetPaginatedUsersByRoleQuery(UserRole.PATIENT, paginationParams),
    );

    const patientsIds = paginatedPatients.items.map((patient) => patient.id);

    const doctorPatientsByDoctor = await this.queryBus.execute(
      new GetDoctorPatientsByDoctorIdAndPatientIdsQuery(doctorId, patientsIds),
    );

    return {
      ...paginatedPatients,
      items: paginatedPatients.items.map((patient) =>
        UserWithDoctorPatientInfoMapper.combineUserAndDoctorPatient(
          patient,
          doctorPatientsByDoctor.find((dp) => dp.patientId === patient.id),
        ),
      ),
    };
  }
}
