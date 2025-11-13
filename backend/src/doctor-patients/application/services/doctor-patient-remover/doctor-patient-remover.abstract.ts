import { UUID } from 'node:crypto';

export abstract class DoctorPatientRemover {
  /**
   * Remove a patient from a doctor's list (unassigns tests and marks DoctorPatient as unassigned)
   * @param doctorId - UUID of the doctor
   * @param patientId - UUID of the patient
   * @throws {DoctorPatientNotFoundException} - If the DoctorPatient relationship does not exist
   */
  abstract remove(doctorId: UUID, patientId: UUID): Promise<void>;
}
