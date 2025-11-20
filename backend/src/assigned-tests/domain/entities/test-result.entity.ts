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
  testId: UUID;

  @Column('uuid')
  @RelationId((testResult: TestResult) => testResult.completedByPatient)
  completedByPatientId: UUID;

  @ManyToOne(() => User)
  completedByPatient: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  completedAt: Date;

  @Column('jsonb')
  resultsData: Record<string, any>;

  @Column('jsonb', { nullable: true })
  verdictData?: Record<string, any>;

  static create({
    testId,
    passedByPatientId,
    answers,
  }: CreateTestResultProps): TestResult {
    const testResult = new TestResult();
    testResult.testId = testId;
    testResult.completedByPatientId = passedByPatientId;
    testResult.resultsData = answers;
    testResult.completedAt = new Date();
    return testResult;
  }
}

interface CreateTestResultProps {
  testId: UUID;
  passedByPatientId: UUID;
  answers: Record<string, any>;
}
