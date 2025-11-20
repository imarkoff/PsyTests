import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { PatientAssignedTestsOrchestratorImpl } from '../../../application/services/patient-assigned-tests-orchestrator/patient-assigned-tests-orchestrator.impl';
import { GetAssignedTestsByPatientIdQuery } from '../../../application/queries/get-assigned-tests-by-patient-id/get-assigned-tests-by-patient-id.query';
import { createAssignedTestDtoFixture } from '../../fixtures/assigned-test-dto.fixture';
import { AssignedTestDto } from '../../../presentation/dtos/assigned-test.dto';

describe(PatientAssignedTestsOrchestratorImpl.name, () => {
  let orchestrator: PatientAssignedTestsOrchestratorImpl;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;

  const mockPatientId = randomUUID();
  const mockAssignedTestDto = createAssignedTestDtoFixture({
    assignedToPatientId: mockPatientId,
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PatientAssignedTestsOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    orchestrator = module.get(PatientAssignedTestsOrchestratorImpl);
    queryBus = module.get(QueryBus);
  });

  describe('getAssignedTests', () => {
    it('should return assigned tests dto array', async () => {
      const expectedResult = [mockAssignedTestDto];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await orchestrator.getAssignedTests(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no assigned tests found', async () => {
      const expectedResult: AssignedTestDto[] = [];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await orchestrator.getAssignedTests(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('calls the QueryBus with correct parameters', async () => {
      queryBus.execute.mockResolvedValue([mockAssignedTestDto]);

      await orchestrator.getAssignedTests(mockPatientId);

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
        orchestrator.getAssignedTests(mockPatientId),
      ).rejects.toThrow(error);
    });
  });
});
