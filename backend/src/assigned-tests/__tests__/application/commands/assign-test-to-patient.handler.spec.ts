import { AssignTestToPatientHandler } from '../../../application/commands/assign-test-to-patient/assign-test-to-patient.handler';
import { QueryBus } from '@nestjs/cqrs';
import { AssignedTestsRepository } from '../../../domain/interfaces/assigned-tests.repository';
import { Test } from '@nestjs/testing';
import { createPsyTestFixture } from '../../../../psy-tests/__tests__/fixtures/psy-test.fixture';
import { createUserFixture } from '../../../../users/__tests__/fixtures/user.fixture';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { createDoctorPatientFixture } from '../../../../doctor-patients/__tests__/fixtures/doctor-patient.fixture';
import { createAssignedTestFixture } from '../../fixtures/assigned-test.fixture';
import { AssignTestToPatientCommand } from '../../../application/commands/assign-test-to-patient/assign-test-to-patient.command';
import { GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery } from '../../../../doctor-patients/application/queries/get-assigned-doctor-patient-by-doctor-id-and-patient-id/get-assigned-doctor-patient-by-doctor-id-and-patient-id.query';
import { DoctorPatientNotFoundException } from '../../../../doctor-patients/domain/exceptions/doctor-patient-not-found.exception';
import { TestAlreadyAssignedException } from '../../../domain/exceptions/test-already-assigned.exception';
import { PsyTestNotFoundException } from '../../../../psy-tests/domain/exceptions/psy-test-not-found.exception';
import { UserNotFoundException } from '../../../../users/domain/exceptions/user-not-found.exception';
import { AssignedTest } from '../../../domain/entities/assigned-test.entity';
import { AssignedTestMapper } from '../../../application/mappers/assigned-test.mapper';
import { GetPsyTestMetadataByIdOrThrowQuery } from '../../../../psy-tests/application/queries/get-psy-test-metadata-by-id-or-throw/get-psy-test-metadata-by-id-or-throw.query';
import { GetUserModelByIdOrThrowQuery } from '../../../../users/application/queries/get-user-model-by-id-or-throw/get-user-model-by-id-or-throw.query';

describe(AssignTestToPatientHandler.name, () => {
  let handler: AssignTestToPatientHandler;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let repository: Pick<
    jest.Mocked<AssignedTestsRepository>,
    'getAssignedTestByTestIdAndPatientId' | 'createTest'
  >;

  const mockTest = createPsyTestFixture();
  const mockDoctor = createUserFixture({ role: UserRole.DOCTOR });
  const mockPatient = createUserFixture({ role: UserRole.PATIENT });
  const mockDoctorPatient = createDoctorPatientFixture({
    doctorId: mockDoctor.id,
    patientId: mockPatient.id,
  });
  const mockAssignedTest = createAssignedTestFixture({
    testId: mockTest.id,
    assignedByDoctorId: mockDoctor.id,
    assignedToPatientId: mockPatient.id,
  });

  const setupSuccessfulExecution = () => {
    queryBus.execute
      .mockResolvedValueOnce(mockDoctorPatient) // Doctor-Patient relation
      .mockResolvedValueOnce(mockTest) // Get test metadata
      .mockResolvedValueOnce(mockDoctor) // Get doctor user model
      .mockResolvedValueOnce(mockPatient); // Get patient user model
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValueOnce(null);
    repository.createTest.mockResolvedValueOnce(mockAssignedTest);
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        AssignTestToPatientHandler,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
        {
          provide: AssignedTestsRepository,
          useValue: <typeof repository>{
            getAssignedTestByTestIdAndPatientId: jest.fn(),
            createTest: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get(AssignTestToPatientHandler);
    queryBus = module.get(QueryBus);
    repository = module.get(AssignedTestsRepository);
  });

  it('should ensure doctor-patient relation exists', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    const getDoctorPatientQueryCall = queryBus.execute.mock.calls.find(
      (call) =>
        call[0] instanceof GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery,
    );
    expect(getDoctorPatientQueryCall).toBeDefined();
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as GetAssignedDoctorPatientByDoctorIdAndPatientIdQuery),
    );
  });

  it('should throw error if doctor-patient relation does not exist', async () => {
    queryBus.execute.mockResolvedValueOnce(null);

    await expect(
      handler.execute({
        testId: mockTest.id,
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as AssignTestToPatientCommand),
    ).rejects.toThrow(DoctorPatientNotFoundException);
  });

  it('should validate if test is already assigned to patient', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    expect(repository.getAssignedTestByTestIdAndPatientId).toHaveBeenCalledWith(
      mockTest.id,
      mockPatient.id,
    );
  });

  it('should throw an exception if test is already assigned to patient', async () => {
    queryBus.execute.mockResolvedValueOnce(mockDoctorPatient);
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValueOnce(
      mockAssignedTest,
    );

    await expect(
      handler.execute({
        testId: mockTest.id,
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as AssignTestToPatientCommand),
    ).rejects.toThrow(TestAlreadyAssignedException);
  });

  it('should get test metadata', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    const getTestMetadataQueryCall = queryBus.execute.mock.calls.find(
      (call) => call[0] instanceof GetPsyTestMetadataByIdOrThrowQuery,
    );
    expect(getTestMetadataQueryCall).toBeDefined();
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        testId: mockTest.id,
      } as GetPsyTestMetadataByIdOrThrowQuery),
    );
  });

  it('should propagate exception if GetPsyTestMetadataByIdOrThrowQuery fails', async () => {
    queryBus.execute.mockResolvedValueOnce(mockDoctorPatient);
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValueOnce(null);
    const error = new PsyTestNotFoundException(mockTest.id);
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(
      handler.execute({
        testId: mockTest.id,
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as AssignTestToPatientCommand),
    ).rejects.toThrow(PsyTestNotFoundException);
  });

  it('should get doctor and patient user models', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    const getUserModelCall = queryBus.execute.mock.calls.find(
      (call) => call[0] instanceof GetUserModelByIdOrThrowQuery,
    );
    expect(getUserModelCall).toBeDefined();
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockDoctor.id,
      } as GetUserModelByIdOrThrowQuery),
    );
    expect(queryBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockPatient.id,
      } as GetUserModelByIdOrThrowQuery),
    );
  });

  it('should propagate exception if GetUserModelByIdOrThrowQuery fails for doctor', async () => {
    queryBus.execute.mockResolvedValueOnce(mockDoctorPatient);
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValueOnce(null);
    queryBus.execute.mockResolvedValueOnce(mockTest);
    const error = new UserNotFoundException(mockDoctor.id);
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(
      handler.execute({
        testId: mockTest.id,
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as AssignTestToPatientCommand),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should propagate exception if GetUserModelByIdOrThrowQuery fails for patient', async () => {
    queryBus.execute.mockResolvedValueOnce(mockDoctorPatient);
    repository.getAssignedTestByTestIdAndPatientId.mockResolvedValueOnce(null);
    queryBus.execute.mockResolvedValueOnce(mockTest);
    queryBus.execute.mockResolvedValueOnce(mockDoctor);
    const error = new UserNotFoundException(mockPatient.id);
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(
      handler.execute({
        testId: mockTest.id,
        doctorId: mockDoctor.id,
        patientId: mockPatient.id,
      } as AssignTestToPatientCommand),
    ).rejects.toThrow(UserNotFoundException);
  });

  it('should correctly call repository.createTest', async () => {
    setupSuccessfulExecution();

    await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    const passedAssignedTest = repository.createTest.mock.calls[0][0];
    expect(passedAssignedTest).toBeInstanceOf(AssignedTest);
    expect(passedAssignedTest.testId).toBe(mockTest.id);
    expect(passedAssignedTest.assignedByDoctorId).toBe(mockDoctor.id);
    expect(passedAssignedTest.assignedToPatientId).toBe(mockPatient.id);
  });

  it('should return the assigned test DTO', async () => {
    const expectedDto = AssignedTestMapper.toDto(mockAssignedTest, mockTest);
    setupSuccessfulExecution();

    const result = await handler.execute({
      testId: mockTest.id,
      doctorId: mockDoctor.id,
      patientId: mockPatient.id,
    } as AssignTestToPatientCommand);

    expect(result).toEqual(expectedDto);
  });
});
