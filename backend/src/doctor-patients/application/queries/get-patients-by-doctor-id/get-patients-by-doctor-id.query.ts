import { Query } from '@nestjs/cqrs';
import { PaginatedList } from '../../../../shared/pagination/domain/types/paginated-list.type';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { UUID } from 'node:crypto';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

export class GetPatientsByDoctorIdQuery extends Query<
  PaginatedList<DoctorPatientDto, DoctorPatient>
> {
  constructor(
    public readonly doctorId: UUID,
    public readonly paginationParams: PaginationParams<DoctorPatient>,
  ) {
    super();
  }
}
