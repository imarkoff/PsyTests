import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AssignTestToPatientCommand } from './assign-test-to-patient.command';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { GetPsyTestMetadataByIdQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id/get-psy-test-metadata-by-id.query';
import { PsyTestNotFoundException } from '../../../../psy-tests/domain/exceptions/psy-test-not-found.exception';
import { GetUserModelByIdQuery } from '../../../../users/application/queries/get-user-model-by-id/get-user-model-by-id.query';
import { UserNotFoundException } from '../../../../users/domain/exceptions/user-not-found.exception';
import { AssignedTestMapper } from '../../mappers/assigned-test.mapper';
import { UUID } from 'node:crypto';
import { TestAlreadyAssignedException } from '../../../domain/exceptions/test-already-assigned.exception';
import { DoctorPatientNotFoundException } from '../../../../doctor-patients/domain/exceptions/doctor-patient-not-found.exception';
import { GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery } from '../../../../doctor-patients/application/queries/get-assigned-doctor-patient-by-doctor-id-and-patient-id/get-assigned-doctor-patient-by-doctor-id-and-patient-id.query';

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
    await this.checkDoctorPatientRelationExists(doctorId, patientId);
    await this.validateIfTestAlreadyAssigned(testId, patientId);

    const test = await this.getPsyTest(testId);
    const doctor = await this.getUserModel(doctorId);
    const patient = await this.getUserModel(patientId);

    const assignedTest = AssignedTestMapper.create(testId, doctor, patient);
    const savedAssignedTest = await this.repository.createTest(assignedTest);

    return AssignedTestMapper.toDto(savedAssignedTest, test);
  }

  private async validateIfTestAlreadyAssigned(testId: UUID, patientId: UUID) {
    const existingAssignment =
      await this.repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );

    if (existingAssignment) {
      throw new TestAlreadyAssignedException(testId, patientId);
    }
  }

  private async checkDoctorPatientRelationExists(
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

  private async getPsyTest(testId: UUID) {
    const test = await this.queryBus.execute(
      new GetPsyTestMetadataByIdQuery(testId),
    );
    if (!test) {
      throw new PsyTestNotFoundException(testId);
    }
    return test;
  }

  private async getUserModel(userId: UUID) {
    const user = await this.queryBus.execute(new GetUserModelByIdQuery(userId));
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  }
}
