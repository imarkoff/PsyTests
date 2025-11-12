import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class UnassignDoctorPatientCommand extends Command<void> {
  /**
   * Unassigns a doctor from a patient.
   * @param doctorId - The ID of the doctor to unassign (User Entity).
   * @param patientId - The ID of the patient to unassign (User Entity).
   * @throw {DoctorPatientNotFoundException} When the doctor-patient assignment does not exist.
   */
  constructor(
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
