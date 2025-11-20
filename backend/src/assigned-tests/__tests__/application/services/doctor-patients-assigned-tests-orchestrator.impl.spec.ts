import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { DoctorPatientsAssignedTestsOrchestratorImpl } from '../../../application/services/doctor-patients-assigned-tests-orchestrator/doctor-patients-assigned-tests-orchestrator.impl';
import { AssignTestToPatientCommand } from '../../../application/commands/assign-test-to-patient/assign-test-to-patient.command';
import { UnassignTestCommand } from '../../../application/commands/unassign-test/unassign-test.command';
import { GetAssignedTestsByPatientIdQuery } from '../../../application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.query';
import { createAssignedTestDtoFixture } from '../../fixtures/assigned-test-dto.fixture';

describe(DoctorPatientsAssignedTestsOrchestratorImpl.name, () => {
  let orchestrator: DoctorPatientsAssignedTestsOrchestratorImpl;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let commandBus: Pick<jest.Mocked<CommandBus>, 'execute'>;

  const mockPatientId = randomUUID();
  const mockDoctorId = randomUUID();
  const mockAssignedTestDto = createAssignedTestDtoFixture({
    assignedToPatientId: mockPatientId,
    assignedByDoctorId: mockDoctorId,
  });
  const mockTestId = mockAssignedTestDto.test.id;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DoctorPatientsAssignedTestsOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: <typeof commandBus>{
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    orchestrator = module.get(DoctorPatientsAssignedTestsOrchestratorImpl);
    queryBus = module.get(QueryBus);
    commandBus = module.get(CommandBus);
  });

  describe('getAssignedTestsByPatientId', () => {
    it('should return assigned tests dto array', async () => {
      const expectedResult = [mockAssignedTestDto];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result =
        await orchestrator.getAssignedTestsByPatientId(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('calls the QueryBus with correct parameters', async () => {
      await orchestrator.getAssignedTestsByPatientId(mockPatientId);

      const queryCall = queryBus.execute.mock.calls[0][0];
      expect(queryCall).toBeInstanceOf(GetAssignedTestsByPatientIdQuery);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({ patientId: mockPatientId }),
      );
    });

    it('propagates errors from the QueryBus', async () => {
      const error = new Error('Query failed');
      queryBus.execute.mockRejectedValue(error);

      await expect(
        orchestrator.getAssignedTestsByPatientId(mockPatientId),
      ).rejects.toThrow(error);
    });
  });

  describe('assignTestToPatient', () => {
    it('should return assigned test dto', async () => {
      commandBus.execute.mockResolvedValue(mockAssignedTestDto);

      const result = await orchestrator.assignTestToPatient(
        mockTestId,
        mockDoctorId,
        mockPatientId,
      );

      expect(result).toEqual(mockAssignedTestDto);
    });

    it('calls the CommandBus with correct parameters', async () => {
      await orchestrator.assignTestToPatient(
        mockTestId,
        mockDoctorId,
        mockPatientId,
      );

      const commandCall = commandBus.execute.mock.calls[0][0];
      expect(commandCall).toBeInstanceOf(AssignTestToPatientCommand);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          testId: mockTestId,
          doctorId: mockDoctorId,
          patientId: mockPatientId,
        }),
      );
    });
  });

  describe('unassignTestFromPatient', () => {
    it('calls the CommandBus with correct parameters', async () => {
      commandBus.execute.mockResolvedValue(undefined);

      await orchestrator.unassignTestFromPatient(
        mockTestId,
        mockDoctorId,
        mockPatientId,
      );

      const commandCall = commandBus.execute.mock.calls[0][0];
      expect(commandCall).toBeInstanceOf(UnassignTestCommand);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          testId: mockTestId,
          doctorId: mockDoctorId,
          patientId: mockPatientId,
        }),
      );
    });

    it('propagates errors from the CommandBus', async () => {
      const error = new Error('Command failed');
      commandBus.execute.mockRejectedValue(error);

      await expect(
        orchestrator.unassignTestFromPatient(
          mockTestId,
          mockDoctorId,
          mockPatientId,
        ),
      ).rejects.toThrow(error);
    });
  });
});
