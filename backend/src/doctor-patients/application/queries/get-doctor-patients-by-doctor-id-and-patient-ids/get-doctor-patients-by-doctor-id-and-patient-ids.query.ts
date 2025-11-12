import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

export class GetDoctorPatientsByDoctorIdAndPatientIdsQuery extends Query<
  DoctorPatientDto[]
> {
  /**
   * Finds all active doctor-patient relationships for a given doctor and a list of patient IDs.
   * @param doctorId - The UUID of the doctor
   * @param patientIds - An array of UUIDs representing patient IDs
   * @returns A promise that resolves to an array of DoctorPatient entities
   */
  constructor(
    public readonly doctorId: UUID,
    public readonly patientIds: UUID[],
  ) {
    super();
  }
}
