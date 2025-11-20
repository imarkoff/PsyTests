import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnassignTestCommand } from './unassign-test.command';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { AssignedTestNotFoundException } from '../../../domain/exceptions/assigned-test-not-found.exception';
import { UUID } from 'node:crypto';

@CommandHandler(UnassignTestCommand)
export class UnassignTestHandler
  implements ICommandHandler<UnassignTestCommand>
{
  constructor(private readonly repository: AssignedTestsRepository) {}

  async execute({
    testId,
    doctorId,
    patientId,
  }: UnassignTestCommand): Promise<void> {
    const assignedTest = await this.getAssignedTestOrThrow(
      testId,
      doctorId,
      patientId,
    );
    await this.repository.unassignTest(assignedTest);
  }

  private async getAssignedTestOrThrow(
    testId: UUID,
    doctorId: UUID,
    patientId: UUID,
  ) {
    const assignedTest =
      await this.repository.getAssignedTestByTestIdDoctorIdAndPatientId(
        testId,
        doctorId,
        patientId,
      );
    if (!assignedTest) {
      throw new AssignedTestNotFoundException(testId, doctorId, patientId);
    }
    return assignedTest;
  }
}
