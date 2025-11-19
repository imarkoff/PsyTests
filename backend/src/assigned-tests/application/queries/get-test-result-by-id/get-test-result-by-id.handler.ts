import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetTestResultByIdQuery } from './get-test-result-by-id.query';
import { TestResultDto } from 'src/assigned-tests/presentation/dtos/test-result.dto';
import { TestResultsRepository } from '../../../domain/interfaces/test-results.repository';
import { TestResultMapper } from '../../mappers/test-result.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';

@QueryHandler(GetTestResultByIdQuery)
export class GetTestResultByIdHandler
  implements IQueryHandler<GetTestResultByIdQuery>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: TestResultsRepository,
  ) {}

  async execute({
    testResultId,
  }: GetTestResultByIdQuery): Promise<TestResultDto | null> {
    const testResult = await this.repository.getById(testResultId);

    if (!testResult) {
      return null;
    }

    const test = await this.queryBus.execute(
      new GetPsyTestMetadataByIdOrThrowQuery(testResult.testId),
    );

    return TestResultMapper.toDto(testResult, test);
  }
}
