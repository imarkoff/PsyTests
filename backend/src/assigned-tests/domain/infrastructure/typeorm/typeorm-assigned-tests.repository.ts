import { UUID } from 'crypto';
import { DbPaginated } from 'src/shared/pagination/domain/types/db-paginated.type';
import { PaginationParams } from 'src/shared/pagination/domain/types/pagination-params.type';
import { AssignedTest } from '../../entities/assigned-test.entity';
import { AssignedTestsRepository } from '../../interfaces/assigned-tests.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { TypeOrmPaginator } from '../../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';

@Injectable()
export class TypeOrmAssignedTestsRepository implements AssignedTestsRepository {
  private readonly repository: Repository<AssignedTest>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly paginator: TypeOrmPaginator,
  ) {
    this.repository = this.dataSource.getRepository(AssignedTest);
  }

  getById(assignedTestId: UUID): Promise<AssignedTest | null> {
    return this.repository.findOneBy({ id: assignedTestId });
  }

  getAssignedTestByTestIdAndPatientId(
    testId: UUID,
    patientId: UUID,
  ): Promise<AssignedTest | null> {
    return this.repository.findOneBy({
      testId: testId,
      assignedToPatientId: patientId,
      unassignedAt: IsNull(),
    });
  }

  getAssignedTestsByPatientId(patientId: UUID): Promise<AssignedTest[]> {
    return this.repository.findBy({
      assignedToPatientId: patientId,
      unassignedAt: IsNull(),
    });
  }

  getAssignedTestsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<AssignedTest>,
  ): Promise<DbPaginated<AssignedTest>> {
    return this.paginator.paginate({
      model: AssignedTest,
      paginationParams,
      where: { assignedByDoctorId: doctorId },
      include: {
        assignedToPatient: true,
      },
    });
  }

  createTest(assignedTest: AssignedTest): Promise<AssignedTest> {
    return this.repository.save(assignedTest);
  }

  unassignTest(assignedTest: AssignedTest): Promise<AssignedTest> {
    assignedTest.unassignedAt = new Date();
    return this.repository.save(assignedTest);
  }

  async unassignTestsByPatientIdAndDoctorId(
    patientId: UUID,
    doctorId: UUID,
  ): Promise<void> {
    await this.repository.update(
      {
        assignedToPatientId: patientId,
        assignedByDoctorId: doctorId,
        unassignedAt: IsNull(),
      },
      { unassignedAt: new Date() },
    );
  }

  async unassignTestsByPatientId(patientId: UUID): Promise<void> {
    await this.repository.update(
      {
        assignedToPatientId: patientId,
        unassignedAt: IsNull(),
      },
      { unassignedAt: new Date() },
    );
  }

  async unassignTestsByDoctorId(doctorId: UUID): Promise<void> {
    await this.repository.update(
      {
        assignedByDoctorId: doctorId,
        unassignedAt: IsNull(),
      },
      { unassignedAt: new Date() },
    );
  }
}
