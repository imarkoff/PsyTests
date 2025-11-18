import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetShortTestResultsByPatientIdQuery } from './get-short-test-results-by-patient-id.query';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { TestResultsRepository } from '../../../domain/interfaces/test-results.repository';
import { PsyTestDto } from '../../../../psy-tests/presentation/dtos/psy-test.dto';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { TestResultMapper } from '../../mappers/test-result.mapper';

@QueryHandler(GetShortTestResultsByPatientIdQuery)
export class GetShortTestResultsByPatientIdHandler
  implements IQueryHandler<GetShortTestResultsByPatientIdQuery>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: TestResultsRepository,
  ) {}

  async execute({
    patientId,
  }: GetShortTestResultsByPatientIdQuery): Promise<TestResultShortDto[]> {
    const testResults = await this.repository.getByPatientIdDesc(patientId);

    const psyTests: PsyTestDto[] = [];

    for (const result of testResults) {
      const psyTest = await this.queryBus.execute(
        new GetPsyTestMetadataByIdOrThrowQuery(result.testId),
      );
      psyTests.push(psyTest);
    }

    return testResults.map((result, index) =>
      TestResultMapper.toShortDto(result, psyTests[index]),
    );
  }
}
