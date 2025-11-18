import { TestResult } from '../../domain/entities/test-result.entity';
import { TestResultDto } from '../../presentation/dtos/test-result.dto';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';
import { UUID } from 'node:crypto';
import { TestResultShortDto } from '../../presentation/dtos/test-result-short.dto';

export class TestResultMapper {
  static toDto(entity: TestResult, test: PsyTestDto): TestResultDto {
    const dto = new TestResultDto();
    dto.id = entity.id;
    dto.test = test;
    dto.completedByPatientId = entity.completedByPatientId;
    dto.completedAt = entity.completedAt;
    dto.resultsData = entity.resultsData;
    dto.verdictData = entity.verdictData;
    return dto;
  }

  static toShortDto(entity: TestResult, test: PsyTestDto): TestResultShortDto {
    const dto = new TestResultShortDto();
    dto.id = entity.id;
    dto.test = test;
    dto.completedAt = entity.completedAt;
    return dto;
  }

  static createNewEntity(
    testId: UUID,
    passedByPatientId: UUID,
    answers: Record<string, any>,
  ): TestResult {
    const testResult = new TestResult();
    testResult.testId = testId;
    testResult.completedByPatientId = passedByPatientId;
    testResult.resultsData = answers;
    testResult.completedAt = new Date();
    return testResult;
  }
}
