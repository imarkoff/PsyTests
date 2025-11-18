import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestMetadataByIdOrThrowQuery } from './get-psy-test-metadata-by-id-or-throw.query';
import { PsyTestDto } from 'src/psy-tests/presentation/dtos/psy-test.dto';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestNotFoundException } from '../../../domain/exceptions/psy-test-not-found.exception';

@QueryHandler(GetPsyTestMetadataByIdOrThrowQuery)
export class GetPsyTestMetadataByIdOrThrowHandler
  implements IQueryHandler<GetPsyTestMetadataByIdOrThrowQuery>
{
  constructor(private readonly gateway: PsyTestsEngineGateway) {}

  async execute({
    testId,
  }: GetPsyTestMetadataByIdOrThrowQuery): Promise<PsyTestDto> {
    const test = await this.gateway.getTestMetadataById(testId);
    if (!test) throw new PsyTestNotFoundException(testId);
    return test;
  }
}
