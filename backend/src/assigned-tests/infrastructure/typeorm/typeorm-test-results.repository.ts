import { TestResultsRepository } from '../../domain/interfaces/test-results.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TestResult } from '../../domain/entities/test-result.entity';
import { UUID } from 'node:crypto';
import { SortDirection } from '../../../shared/pagination/domain/enums/sort-direction.enum';

@Injectable()
export class TypeOrmTestResultsRepository implements TestResultsRepository {
  private readonly repository: Repository<TestResult>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(TestResult);
  }

  getByPatientIdDesc(patientId: UUID): Promise<TestResult[]> {
    return this.repository.find({
      where: { completedByPatientId: patientId },
      order: {
        completedAt: SortDirection.DESC,
      },
    });
  }

  getById(testResultId: UUID): Promise<TestResult | null> {
    return this.repository.findOne({
      where: { id: testResultId },
      relations: { completedByPatient: true },
    });
  }

  create(testResult: TestResult): Promise<TestResult> {
    return this.repository.save(testResult);
  }

  update(testResult: TestResult): Promise<TestResult> {
    return this.repository.save(testResult);
  }
}
