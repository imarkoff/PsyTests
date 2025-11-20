import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { PatientTestResultsOrchestratorImpl } from '../../../application/services/patient-test-results-orchestrator/patient-test-results-orchestrator.impl';
import { PassAssignedTestCommand } from '../../../application/commands/pass-assigned-test/pass-assigned-test.command';
import { GetShortTestResultsByPatientIdQuery } from '../../../application/queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.query';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { createTestResultShortDtoFixture } from '../../fixtures/test-result-short-dto.fixture';

describe(PatientTestResultsOrchestratorImpl.name, () => {
  let orchestrator: PatientTestResultsOrchestratorImpl;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;
  let commandBus: Pick<jest.Mocked<CommandBus>, 'execute'>;

  const mockPatientId = randomUUID();
  const mockAnswers: Record<string, any> = { question1: 'answer1' };
  const mockTestResultShortDto = createTestResultShortDtoFixture();
  const mockTestId = mockTestResultShortDto.test.id;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PatientTestResultsOrchestratorImpl,
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

    orchestrator = module.get(PatientTestResultsOrchestratorImpl);
    queryBus = module.get(QueryBus);
    commandBus = module.get(CommandBus);
  });

  describe('passAssignedTest', () => {
    it('should return test result short dto', async () => {
      commandBus.execute.mockResolvedValue(mockTestResultShortDto);

      const result = await orchestrator.passAssignedTest(
        mockTestId,
        mockPatientId,
        mockAnswers,
      );

      expect(result).toEqual(mockTestResultShortDto);
    });

    it('calls the CommandBus with correct parameters', async () => {
      await orchestrator.passAssignedTest(
        mockTestId,
        mockPatientId,
        mockAnswers,
      );

      const commandCall = commandBus.execute.mock.calls[0][0];
      expect(commandCall).toBeInstanceOf(PassAssignedTestCommand);
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.objectContaining(<PassAssignedTestCommand>{
          testId: mockTestId,
          passedByPatientId: mockPatientId,
          answers: mockAnswers,
        }),
      );
    });

    it('propagates errors from the CommandBus', async () => {
      const error = new Error('Command failed');
      commandBus.execute.mockRejectedValue(error);

      await expect(
        orchestrator.passAssignedTest(mockTestId, mockPatientId, mockAnswers),
      ).rejects.toThrow(error);
    });
  });

  describe('getPassedTests', () => {
    it('should return test result short dtos array', async () => {
      const expectedResult = [mockTestResultShortDto];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await orchestrator.getPassedTests(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no passed tests found', async () => {
      const expectedResult: TestResultShortDto[] = [];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result = await orchestrator.getPassedTests(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('calls the QueryBus with correct parameters', async () => {
      queryBus.execute.mockResolvedValue([mockTestResultShortDto]);

      await orchestrator.getPassedTests(mockPatientId);

      const queryCall = queryBus.execute.mock.calls[0][0];
      expect(queryCall).toBeInstanceOf(GetShortTestResultsByPatientIdQuery);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({ patientId: mockPatientId }),
      );
    });

    it('propagates errors from the QueryBus', async () => {
      const error = new Error('Query failed');
      queryBus.execute.mockRejectedValue(error);

      await expect(orchestrator.getPassedTests(mockPatientId)).rejects.toThrow(
        error,
      );
    });
  });
});
