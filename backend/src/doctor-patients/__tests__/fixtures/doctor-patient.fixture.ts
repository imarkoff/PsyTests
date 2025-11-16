import { DoctorPatient } from '../../domain/entities/doctor-patient.entity';
import { randomUUID } from 'node:crypto';

export const createDoctorPatientFixture = (
  overrides?: Partial<DoctorPatient>,
): DoctorPatient => {
  const persistence: DoctorPatient = {
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

  const doctorPatient = new DoctorPatient();
  Object.assign(doctorPatient, persistence);
  return doctorPatient;
};
