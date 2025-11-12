import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class MarkDoctorPatientAsReadCommand extends Command<void> {
  /**
   * Marks a doctor-patient relationship as read.
   * @param doctorId - The unique identifier of the doctor (User Entity ID).
   * @param patientId - The unique identifier of the patient (User Entity ID).
   * @throws {DoctorPatientNotFoundException} If the doctor-patient relationship does not exist.
   */
  constructor(
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
