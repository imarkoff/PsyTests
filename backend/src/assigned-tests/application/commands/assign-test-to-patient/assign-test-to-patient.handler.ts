import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AssignTestToPatientCommand } from './assign-test-to-patient.command';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { AssignedTestMapper } from '../../mappers/assigned-test.mapper';
import { UUID } from 'node:crypto';
import { TestAlreadyAssignedException } from '../../../domain/exceptions/test-already-assigned.exception';
import { DoctorPatientNotFoundException } from '../../../../doctor-patients/domain/exceptions/doctor-patient-not-found.exception';
import { GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery } from '../../../../doctor-patients/application/queries/get-assigned-doctor-patient-by-doctor-id-and-patient-id/get-assigned-doctor-patient-by-doctor-id-and-patient-id.query';
import { AssignedTest } from '../../../domain/entities/assigned-test.entity';
import { GetUserModelByIdOrThrowQuery } from '../../../../users/application/queries/get-user-model-by-id-or-throw/get-user-model-by-id-or-throw.query';

@CommandHandler(AssignTestToPatientCommand)
export class AssignTestToPatientHandler
  implements ICommandHandler<AssignTestToPatientCommand>
{
  constructor(
    private readonly queryBus: QueryBus,
    private readonly repository: AssignedTestsRepository,
  ) {}

  async execute({
    testId,
    doctorId,
    patientId,
  }: AssignTestToPatientCommand): Promise<AssignedTestDto> {
    await this.ensureDoctorPatientRelationExists(doctorId, patientId);
    await this.ensureTestIsNotAssigned(testId, patientId);

    const test = await this.getTestMetadata(testId);
    const doctor = await this.getUserModel(doctorId);
    const patient = await this.getUserModel(patientId);

    const assignedTest = AssignedTest.create({
      testId,
      doctor,
      patient,
    });
    const savedAssignedTest = await this.repository.createTest(assignedTest);

    return AssignedTestMapper.toDto(savedAssignedTest, test);
  }

  private async ensureDoctorPatientRelationExists(
    doctorId: UUID,
    patientId: UUID,
  ) {
    const doctorPatient = await this.queryBus.execute(
      new GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery(
        doctorId,
        patientId,
      ),
    );
    if (!doctorPatient) {
      throw new DoctorPatientNotFoundException(doctorId, patientId);
    }
  }

  private async ensureTestIsNotAssigned(testId: UUID, patientId: UUID) {
    const existingAssignment =
      await this.repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );
    if (existingAssignment) {
      throw new TestAlreadyAssignedException(testId, patientId);
    }
  }

  private async getTestMetadata(testId: UUID) {
    return this.queryBus.execute(
      new GetPsyTestMetadataByIdOrThrowQuery(testId),
    );
  }

  private async getUserModel(userId: UUID) {
    return this.queryBus.execute(new GetUserModelByIdOrThrowQuery(userId));
  }
}
