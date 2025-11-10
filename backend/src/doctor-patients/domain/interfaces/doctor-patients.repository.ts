import { UUID } from 'node:crypto';
import { DoctorPatient } from '../entities/doctor-patient.entity';
import { DbPaginated } from '../../../shared/pagination/types/db-paginated.type';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';

export abstract class DoctorPatientsRepository {
  /**
   * Get all patients associated with a specific doctor.
   * @param doctorId - The UUID of the doctor.
   * @param paginationParams - Pagination parameters for the query.
   * @return A paginated list of DoctorPatient entities.
   */
  abstract getPatientsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<DoctorPatient>,
  ): Promise<DbPaginated<DoctorPatient>>;

  /**
   * Get a specific patient associated with a specific doctor by their IDs.
   * @param doctorId - The UUID of the doctor.
   * @param patientId - The UUID of the patient.
   */
  abstract getPatientByDoctorAndPatientId(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatient | null>;

  /**
   * Get multiple patients associated with a specific doctor by their IDs.
   * @param doctorId - The UUID of the doctor.
   * @param patientsIds - An array of UUIDs of the patients.
   */
  abstract getPatientsByDoctorAndPatientsIds(
    doctorId: UUID,
    patientsIds: UUID[],
  ): Promise<DoctorPatient[]>;

  /**
   * Create a new doctor-patient relationship.
   * @param doctorPatient - The DoctorPatient entity to be created.
   */
  abstract createDoctorPatient(
    doctorPatient: DoctorPatient,
  ): Promise<DoctorPatient>;

  /**
   * Delete a doctor-patient relationship.
   * @param doctorPatient - The DoctorPatient entity to be deleted.
   */
  abstract deleteDoctorPatient(doctorPatient: DoctorPatient): Promise<void>;

  /**
   * Delete all patients associated with a specific doctor.
   * @param doctorId - The UUID of the doctor.
   */
  abstract deleteAllPatientsOfDoctor(doctorId: UUID): Promise<void>;

  /**
   * Delete all doctor relationships of a specific patient.
   * @param patientId - The UUID of the patient.
   */
  abstract deleteAllRelationsOfPatient(patientId: UUID): Promise<void>;

  /**
   * Change the needsAttention status of a doctor-patient relationship.
   * @param doctorPatient - The DoctorPatient entity to be updated.
   * @param needsAttention - The new needsAttention status.
   */
  abstract changeNeedsAttentionStatus(
    doctorPatient: DoctorPatient,
    needsAttention: boolean,
  ): Promise<DoctorPatient>;

  /**
   * Change the assigned status of a doctor-patient relationship.
   * @param doctorPatient - The DoctorPatient entity to be updated.
   * @param isAssigned - The new assigned status.
   */
  abstract changeAssignedStatus(
    doctorPatient: DoctorPatient,
    isAssigned: boolean,
  ): Promise<DoctorPatient>;
}
