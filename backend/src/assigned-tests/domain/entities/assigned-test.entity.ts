import type { UUID } from 'node:crypto';
import { User } from '../../../users/domain/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class AssignedTest {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ type: 'uuid' })
  testId: UUID;

  @Column()
  @RelationId((assignedTest: AssignedTest) => assignedTest.assignedToPatient)
  assignedToPatientId: UUID;

  @ManyToOne(() => User, { nullable: true })
  assignedToPatient: User | null;

  @Column()
  @RelationId((assignedTest: AssignedTest) => assignedTest.assignedByDoctor)
  assignedByDoctorId: UUID;

  @ManyToOne(() => User, { nullable: true })
  assignedByDoctor: User | null;

  @Column({ type: 'timestamp' })
  assignedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  unassignedAt: Date | null;

  static create({
    testId,
    doctor,
    patient,
  }: CreateAssignedTestProps): AssignedTest {
    const entity = new AssignedTest();
    entity.testId = testId;
    entity.assignedByDoctorId = doctor.id;
    entity.assignedByDoctor = doctor;
    entity.assignedToPatientId = patient.id;
    entity.assignedToPatient = patient;
    entity.assignedAt = new Date();
    return entity;
  }
}

export interface CreateAssignedTestProps {
  testId: UUID;
  doctor: User;
  patient: User;
}
