import { AssignedTest as PrismaAssignedTest } from 'generated/prisma';
import { UUID } from 'node:crypto';
import { User } from '../../../users/domain/entities/user.entity';

export type { PrismaAssignedTest };

export class AssignedTest implements PrismaAssignedTest {
  id: UUID;
  testId: UUID;
  assignedToPatientId: UUID;
  assignedToPatient: User | null;
  assignedByDoctorId: UUID;
  assignedByDoctor: User | null;
  assignedAt: Date;
  unassignedAt: Date | null;

  private constructor() {}

  static fromPersistence(persistence: PrismaAssignedTest): AssignedTest {
    const persistenceWithRelations = persistence as PrismaAssignedTest & {
      assignedToPatient: User | null;
      assignedByDoctor: User | null;
    };

    const assignedTest = new AssignedTest();
    assignedTest.id = persistenceWithRelations.id as UUID;
    assignedTest.testId = persistenceWithRelations.testId as UUID;
    assignedTest.assignedToPatientId =
      persistenceWithRelations.assignedToPatientId as UUID;
    assignedTest.assignedToPatient = persistenceWithRelations.assignedToPatient;
    assignedTest.assignedByDoctorId =
      persistenceWithRelations.assignedByDoctorId as UUID;
    assignedTest.assignedByDoctor = persistenceWithRelations.assignedByDoctor;
    assignedTest.assignedAt = persistenceWithRelations.assignedAt;
    assignedTest.unassignedAt = persistenceWithRelations.unassignedAt;
    return assignedTest;
  }

  toPersistence(): PrismaAssignedTest {
    return {
      id: this.id,
      testId: this.testId,
      assignedToPatientId: this.assignedToPatientId,
      assignedByDoctorId: this.assignedByDoctorId,
      assignedAt: this.assignedAt,
      unassignedAt: this.unassignedAt,
    };
  }
}
