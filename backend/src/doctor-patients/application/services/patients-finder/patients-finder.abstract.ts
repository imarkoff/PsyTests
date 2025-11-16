import { UUID } from 'node:crypto';
import { UserWithDoctorPatientInfoDto } from '../../../presentation/dtos/user-with-doctor-patient-info.dto';
import { PaginatedList } from '../../../../shared/pagination/domain/types/paginated-list.type';
import { User } from '../../../../users/domain/entities/user.entity';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';

export abstract class PatientsFinder {
  /**
   * Find patients by search term for a specific doctor.
   * @param doctorId - The UUID of the doctor
   * @param paginationParams - The pagination parameters including search term
   * @returns A promise that resolves to a PatientSearchDto containing the search results
   */
  abstract find(
    doctorId: UUID,
    paginationParams: PaginationParams<User>,
  ): Promise<PaginatedList<UserWithDoctorPatientInfoDto, User>>;
}
