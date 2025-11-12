import { UUID } from 'node:crypto';
import { PatientCreateDto } from '../../../presentation/dtos/patient-create.dto';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

export abstract class DoctorPatientCreator {
  /**
   * Creates a new patient and assigns them to the specified doctor.
   * @param doctorId - The ID of the doctor to whom the patient will be assigned.
   * @param patientCreate - The data required to create the patient.
   * @returns A promise that resolves to the created DoctorPatientDto.
   * @throws {PhoneIsAlreadyTakenException} if the phone number is already in use.
   * @throws {UserNotFoundException} if the registering user does not exist.
   */
  abstract createDoctorPatient(
    doctorId: UUID,
    patientCreate: PatientCreateDto,
  ): Promise<DoctorPatientDto>;
}
