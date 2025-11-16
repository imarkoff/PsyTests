import { type UUID } from 'node:crypto';
import { User } from '../../../users/domain/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

/** Entity representing the assignment of a patient to a doctor */
@Entity()
export class DoctorPatient {
  /** Unique identifier for the doctor-patient assignment */
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  /** Identifier of the doctor assigned to the patient */
  @Column()
  @RelationId((doctorPatient: DoctorPatient) => doctorPatient.doctor)
  doctorId: UUID;

  /** The doctor assigned to the patient. May be null if not included in query */
  @ManyToOne(() => User, { nullable: true })
  doctor: User | null;

  /** Identifier of the patient assigned to the doctor */
  @Column()
  @RelationId((doctorPatient: DoctorPatient) => doctorPatient.patient)
  patientId: UUID;

  /** The patient assigned to the doctor. May be null if not included in query */
  @ManyToOne(() => User, { nullable: true })
  patient: User | null;

  /** Timestamp when the patient was assigned to the doctor */
  @Column({ type: 'timestamp' })
  assignedAt: Date;

  /** Timestamp when the patient was unassigned from the doctor */
  @Column({ type: 'timestamp', nullable: true })
  unassignedAt: Date | null;

  /** Indicates whether the doctor needs to pay attention to this patient */
  @Column({ type: 'boolean', default: false })
  needsAttention: boolean;

  /** Timestamp when the assignment was soft-deleted */
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
