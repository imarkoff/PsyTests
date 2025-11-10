import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPatientsByDoctorIdQuery } from './get-patients-by-doctor-id.query';
import { DoctorPatient } from 'src/doctor-patients/domain/entities/doctor-patient.entity';
import { PaginatedList } from 'src/shared/pagination/types/paginated-list.type';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Logger } from '@nestjs/common';
import { PaginatedListMapper } from '../../../../shared/pagination/mappers/paginated-list.mapper';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient-dto';
import { DoctorPatientMapper } from '../../mappers/doctor-patient.mapper';

@QueryHandler(GetPatientsByDoctorIdQuery)
export class GetPatientsByDoctorIdHandler
  implements IQueryHandler<GetPatientsByDoctorIdQuery>
{
  private readonly logger = new Logger(GetPatientsByDoctorIdHandler.name);

  constructor(
    private readonly doctorPatientRepository: DoctorPatientsRepository,
  ) {}

  async execute({
    doctorId,
    paginationParams,
  }: GetPatientsByDoctorIdQuery): Promise<
    PaginatedList<DoctorPatientDto, DoctorPatient>
  > {
    this.logger.debug(`Getting patients for doctor with ID: ${doctorId}.`);

    const dbPaginatedPatients =
      await this.doctorPatientRepository.getPatientsByDoctorId(
        doctorId,
        paginationParams,
      );

    return PaginatedListMapper.toDto<DoctorPatientDto, DoctorPatient>(
      paginationParams,
      dbPaginatedPatients,
      (item) => DoctorPatientMapper.toDto(item),
    );
  }
}
