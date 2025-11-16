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
}
