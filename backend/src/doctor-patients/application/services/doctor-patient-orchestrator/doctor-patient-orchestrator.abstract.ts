import { UUID } from 'node:crypto';
import { PaginationParams } from '../../../../shared/pagination/types/pagination-params.type';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { PaginatedList } from '../../../../shared/pagination/types/paginated-list.type';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { PatientCreateDto } from '../../../presentation/dtos/patient-create.dto';
import { UserWithDoctorPatientInfoDto } from '../../../presentation/dtos/user-with-doctor-patient-info.dto';
import { User } from '../../../../users/domain/entities/user.entity';

export abstract class DoctorPatientOrchestrator {
  /**
   * Get active patients assigned to a specific doctor with pagination.
   * @param doctorId - The UUID of the doctor
   * @param paginationParams - The pagination parameters
   * @returns A promise that resolves to a paginated list of DoctorPatientDto
   */
  abstract getActivePatientsByDoctor(
    doctorId: UUID,
    paginationParams: PaginationParams<DoctorPatient>,
  ): Promise<PaginatedList<DoctorPatientDto, DoctorPatient>>;

  /**
   * Get the DoctorPatient relationship by doctor and patient IDs.
   * @param doctorId - The UUID of the doctor
   * @param patientId - The UUID of the patient
   * @returns A promise that resolves to a DoctorPatientDto
   * @throws DoctorPatientNotFoundException if the relationship does not exist
   */
  abstract getDoctorPatientByDoctorAndPatientIds(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatientDto>;

  /**
   * Find patients by search term for a specific doctor.
   * @param doctorId - The UUID of the doctor
   * @param paginationParams - The pagination parameters (including search term)
   * @returns A promise that resolves to a paginated list of UserWithDoctorPatientInfoDto
   */
  abstract findPatients(
    doctorId: UUID,
    paginationParams: PaginationParams<User>,
  ): Promise<PaginatedList<UserWithDoctorPatientInfoDto, User>>;

  /**
   * Create a new patient and assign them to a specific doctor.
   * @param doctorId - The UUID of the doctor
   * @param patientCreate - The data to create the new patient
   * @returns A promise that resolves to a DoctorPatientDto representing the new assignment
   * @throws PhoneIsAlreadyTakenException if the phone number is already in use
   */
  abstract createNewPatientAndAssignToDoctor(
    doctorId: UUID,
    patientCreate: PatientCreateDto,
  ): Promise<DoctorPatientDto>;

  /**
   * Assign an existing patient to a specific doctor.
   * @param doctorId - The UUID of the doctor
   * @param patientId - The UUID of the existing patient
   * @returns A promise that resolves to a DoctorPatientDto representing the assignment
   * @throws DoctorPatientAlreadyExistsException if the patient is already assigned to the doctor
   */
  abstract assignExistingPatientToDoctor(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatientDto>;

  /**
   * Mark the doctor-patient relationship as read, indicating no further attention is needed.
   * @param doctorId - The UUID of the doctor
   * @param patientId - The UUID of the patient
   * @returns A promise that resolves when the operation is complete
   * @throws DoctorPatientNotFoundException if the doctor-patient relationship does not exist
   */
  abstract markDoctorPatientAsRead(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<void>;

  /**
   * Unassign a patient from a specific doctor.
   * @param doctorId - The UUID of the doctor
   * @param patientId - The UUID of the patient
   * @returns A promise that resolves when the operation is complete
   * @throws DoctorPatientNotFoundException if the doctor-patient relationship does not exist
   */
  abstract unassignPatientFromDoctor(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<void>;
}
