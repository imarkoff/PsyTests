import { UUID } from 'node:crypto';
import { AssignedTest } from '../entities/assigned-test.entity';
import { PaginationParams } from '../../../shared/pagination/domain/types/pagination-params.type';
import { DbPaginated } from '../../../shared/pagination/domain/types/db-paginated.type';

export abstract class AssignedTestsRepository {
  abstract getById(assignedTestId: UUID): Promise<AssignedTest | null>;

  abstract getAssignedTestByTestIdAndPatientId(
    testId: UUID,
    patientId: UUID,
  ): Promise<AssignedTest | null>;

  abstract getAssignedTestsByPatientId(
    patientId: UUID,
  ): Promise<AssignedTest[]>;

  abstract getAssignedTestsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<AssignedTest>,
  ): Promise<DbPaginated<AssignedTest>>;

  abstract createTest(assignedTest: AssignedTest): Promise<AssignedTest>;

  abstract unassignTest(assignedTest: AssignedTest): Promise<AssignedTest>;

  abstract unassignTestsByPatientIdAndDoctorId(
    patientId: UUID,
    doctorId: UUID,
  ): Promise<void>;

  abstract unassignTestsByPatientId(patientId: UUID): Promise<void>;

  abstract unassignTestsByDoctorId(doctorId: UUID): Promise<void>;
}
