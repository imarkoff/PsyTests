import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class GetPatientByIdAndDoctorIdQuery extends Query<DoctorPatientDto | null> {
  /**
   * Gets a patient by their ID and the associated doctor's ID.
   * @param doctorId - The unique identifier of the doctor (User Entity ID).
   * @param patientId - The unique identifier of the patient (User Entity ID).
   */
  constructor(
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
