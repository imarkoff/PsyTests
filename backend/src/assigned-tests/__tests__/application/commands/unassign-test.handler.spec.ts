import { UnassignTestHandler } from '../../../application/commands/unassign-test/unassign-test.handler';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { Test } from '@nestjs/testing';
import { createAssignedTestFixture } from '../../fixtures/assigned-test.fixture';
import { UnassignTestCommand } from '../../../application/commands/unassign-test/unassign-test.command';
import { AssignedTestNotFoundException } from '../../../domain/exceptions/assigned-test-not-found.exception';

describe(UnassignTestHandler.name, () => {
  let handler: UnassignTestHandler;

  let repository: Pick<
    jest.Mocked<AssignedTestsRepository>,
    'getAssignedTestByTestIdDoctorIdAndPatientId' | 'unassignTest'
  >;

  const assignedTest = createAssignedTestFixture();

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UnassignTestHandler,
        {
          provide: AssignedTestsRepository,
          useValue: <typeof repository>{
            getAssignedTestByTestIdDoctorIdAndPatientId: jest.fn(),
            unassignTest: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(UnassignTestHandler);
    repository = module.get(AssignedTestsRepository);
  });

  it('should return void on successful unassignment', async () => {
    repository.getAssignedTestByTestIdDoctorIdAndPatientId.mockResolvedValue(
      assignedTest,
    );

    await expect(
      handler.execute({
        testId: assignedTest.testId,
        doctorId: assignedTest.assignedByDoctorId,
        patientId: assignedTest.assignedToPatientId,
      } as UnassignTestCommand),
    ).resolves.toBeUndefined();
  });

  it('should throw AssignedTestNotFoundException if assigned test does not exist', async () => {
    repository.getAssignedTestByTestIdDoctorIdAndPatientId.mockResolvedValue(
      null,
    );

    await expect(
      handler.execute({
        testId: assignedTest.testId,
        doctorId: assignedTest.assignedByDoctorId,
        patientId: assignedTest.assignedToPatientId,
      } as UnassignTestCommand),
    ).rejects.toThrow(AssignedTestNotFoundException);
  });

  it('should call repository.getAssignedTestByTestIdDoctorIdAndPatientId with correct parameters', async () => {
    repository.getAssignedTestByTestIdDoctorIdAndPatientId.mockResolvedValue(
      assignedTest,
    );

    await handler.execute({
      testId: assignedTest.testId,
      doctorId: assignedTest.assignedByDoctorId,
      patientId: assignedTest.assignedToPatientId,
    } as UnassignTestCommand);

    expect(
      repository.getAssignedTestByTestIdDoctorIdAndPatientId,
    ).toHaveBeenCalledTimes(1);
    expect(
      repository.getAssignedTestByTestIdDoctorIdAndPatientId,
    ).toHaveBeenCalledWith(
      assignedTest.testId,
      assignedTest.assignedByDoctorId,
      assignedTest.assignedToPatientId,
    );
  });

  it('should call repository.unassignTest with the assigned test', async () => {
    repository.getAssignedTestByTestIdDoctorIdAndPatientId.mockResolvedValue(
      assignedTest,
    );

    await handler.execute({
      testId: assignedTest.testId,
      doctorId: assignedTest.assignedByDoctorId,
      patientId: assignedTest.assignedToPatientId,
    } as UnassignTestCommand);

    expect(repository.unassignTest).toHaveBeenCalledTimes(1);
    expect(repository.unassignTest).toHaveBeenCalledWith(assignedTest);
  });
});
