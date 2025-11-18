import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetAssignedTestByTestIdAndPatientIdQuery } from './get-assigned-test-by-test-id-and-patient-id.query';
import { AssignedTestDto } from 'src/assigned-tests/presentation/dtos/assigned-test.dto';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { AssignedTestMapper } from '../../mappers/assigned-test.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';

@QueryHandler(GetAssignedTestByTestIdAndPatientIdQuery)
export class GetAssignedTestByTestIdAndPatientIdHandler
  implements IQueryHandler<GetAssignedTestByTestIdAndPatientIdQuery>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: AssignedTestsRepository,
  ) {}

  async execute({
    testId,
    patientId,
  }: GetAssignedTestByTestIdAndPatientIdQuery): Promise<AssignedTestDto | null> {
    const testResult =
      await this.repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );
    if (!testResult) return null;

    const psyTest = await this.queryBus.execute(
      new GetPsyTestMetadataByIdOrThrowQuery(testId),
    );

    return AssignedTestMapper.toDto(testResult, psyTest);
  }
}
