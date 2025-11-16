import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { type UUID } from 'node:crypto';
import { User } from '../../../users/domain/entities/user.entity';

@Entity()
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column('uuid')
  testId: string;

  @RelationId((testResult: TestResult) => testResult.completedByPatient)
  completedByPatientId: string;

  @ManyToOne(() => User)
  completedByPatient: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;

  @Column('jsonb')
  resultsData: Record<string, any>;

  @Column('jsonb', { nullable: true })
  verdictData?: Record<string, any>;
}
