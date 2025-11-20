import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetAssignedTestByTestIdAndPatientIdOrThrowQuery } from './get-assigned-test-by-test-id-and-patient-id-or-throw.query';
import { AssignedTestDto } from 'src/assigned-tests/presentation/dtos/assigned-test.dto';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { AssignedTestMapper } from '../../mappers/assigned-test.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { AssignedTestByTestIdAndPatientIdNotFoundException } from '../../../domain/exceptions/assigned-test-by-test-id-and-patient-id-not-found.exception';

@QueryHandler(GetAssignedTestByTestIdAndPatientIdOrThrowQuery)
export class GetAssignedTestByTestIdAndPatientIdOrThrowHandler
  implements IQueryHandler<GetAssignedTestByTestIdAndPatientIdOrThrowQuery>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: AssignedTestsRepository,
  ) {}

  async execute({
    testId,
    patientId,
  }: GetAssignedTestByTestIdAndPatientIdOrThrowQuery): Promise<AssignedTestDto> {
    const testResult =
      await this.repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );

    if (!testResult) {
      throw new AssignedTestByTestIdAndPatientIdNotFoundException(
        testId,
        patientId,
      );
    }

    const psyTest = await this.queryBus.execute(
      new GetPsyTestMetadataByIdOrThrowQuery(testId),
    );

    return AssignedTestMapper.toDto(testResult, psyTest);
  }
}
