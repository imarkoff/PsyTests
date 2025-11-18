import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetAssignedTestsByPatientIdQuery } from './get-assigned-tests-by-patient-id.query';
import { AssignedTestDto } from 'src/assigned-tests/presentation/dtos/assigned-test.dto';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { AssignedTestMapper } from '../../mappers/assigned-test.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestDto } from '../../../../psy-tests/presentation/dtos/psy-test.dto';

@QueryHandler(GetAssignedTestsByPatientIdQuery)
export class GetAssignedTestsByPatientIdHandler
  implements IQueryHandler<GetAssignedTestsByPatientIdQuery>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: AssignedTestsRepository,
  ) {}

  async execute({
    patientId,
  }: GetAssignedTestsByPatientIdQuery): Promise<AssignedTestDto[]> {
    const assignedTests =
      await this.repository.getAssignedTestsByPatientId(patientId);

    const psyTests: PsyTestDto[] = [];

    for (const at of assignedTests) {
      const test = await this.queryBus.execute(
        new GetPsyTestMetadataByIdOrThrowQuery(at.testId),
      );
      psyTests.push(test);
    }

    return assignedTests.map((at, index) =>
      AssignedTestMapper.toDto(at, psyTests[index]),
    );
  }
}
