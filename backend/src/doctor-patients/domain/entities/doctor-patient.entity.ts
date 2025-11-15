import { DoctorPatient as PrismaDoctorPatient } from 'generated/prisma';
import { randomUUID, UUID } from 'node:crypto';
import { User } from '../../../users/domain/entities/user.entity';

export type { PrismaDoctorPatient };

export class DoctorPatient {
  id: UUID;
  doctorId: UUID;
  doctor: User | null;
  patientId: UUID;
  patient: User | null;
  assignedAt: Date;
  unassignedAt: Date | null;
  needsAttention: boolean;
  deletedAt: Date | null = null;

  private constructor() {}

  static create(doctorId: UUID, patientId: UUID): DoctorPatient {
    const entity = new DoctorPatient();
    entity.id = randomUUID();
    entity.doctorId = doctorId;
    entity.patientId = patientId;
    entity.assignedAt = new Date();
    entity.unassignedAt = null;
    entity.needsAttention = false;
    return entity;
  }

  static fromPersistence(persistence: PrismaDoctorPatient): DoctorPatient {
    const entity = new DoctorPatient();
    entity.id = persistence.id as UUID;
    entity.doctorId = persistence.doctorId as UUID;
    // entity.doctor = persistenceWithDoctorAndPatient.doctor
    //   ? User.fromPersistence(persistenceWithDoctorAndPatient.doctor)
    //   : null;
    entity.patientId = persistence.patientId as UUID;
    // entity.patient = persistenceWithDoctorAndPatient.patient
    //   ? User.fromPersistence(persistenceWithDoctorAndPatient.patient)
    //   : null;
    entity.assignedAt = persistence.assignedAt;
    entity.unassignedAt = persistence.unassignedAt;
    entity.needsAttention = persistence.needsAttention;
    entity.deletedAt = persistence.deletedAt;
    return entity;
  }

  toPersistence(): PrismaDoctorPatient {
    return {
      id: this.id,
      doctorId: this.doctorId,
      patientId: this.patientId,
      assignedAt: this.assignedAt,
      unassignedAt: this.unassignedAt,
      needsAttention: this.needsAttention,
      deletedAt: this.deletedAt,
    };
  }
}
