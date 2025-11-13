import {
  DoctorPatient,
  PrismaDoctorPatient,
} from '../../domain/entities/doctor-patient.entity';
import { randomUUID } from 'node:crypto';

export const createDoctorPatientFixture = (
  overrides?: Partial<DoctorPatient>,
): DoctorPatient => {
  const persistence: PrismaDoctorPatient = {
    id: randomUUID(),
    doctorId: randomUUID(),
    doctor: null,
    patientId: randomUUID(),
    patient: null,
    assignedAt: new Date(),
    unassignedAt: null,
    needsAttention: false,
    deletedAt: null,
    ...overrides,
  };

  return DoctorPatient.fromPersistence(persistence);
};
