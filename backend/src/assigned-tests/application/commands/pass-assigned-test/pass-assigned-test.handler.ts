import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { PassAssignedTestCommand } from './pass-assigned-test.command';
import { TestResultsRepository } from '../../../domain/interfaces/test-results.repository';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { TestResultMapper } from '../../mappers/test-result.mapper';
import { GetAssignedTestByTestIdAndPatientIdOrThrowQuery } from '../../queries/get-assigned-test-by-test-id-and-patient-id-or-throw/get-assigned-test-by-test-id-and-patient-id-or-throw.query';
import { TestResult } from '../../../domain/entities/test-result.entity';

@CommandHandler(PassAssignedTestCommand)
export class PassAssignedTestHandler
  implements ICommandHandler<PassAssignedTestCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly testResultsRepository: TestResultsRepository,
  ) {}

  async execute({
    testId,
    passedByPatientId,
    answers,
  }: PassAssignedTestCommand): Promise<TestResultShortDto> {
    const assignedTest = await this.queryBus.execute(
      new GetAssignedTestByTestIdAndPatientIdOrThrowQuery(
        testId,
        passedByPatientId,
      ),
    );

    const testResult = TestResult.create({
      testId,
      passedByPatientId,
      answers,
    });

    const savedTestResult = await this.testResultsRepository.create(testResult);

    return TestResultMapper.toShortDto(savedTestResult, assignedTest.test);
  }
}
