import { DoctorPatientsTestResultsOrchestratorImpl } from '../../../application/services/doctor-patients-test-results-orchestrator/doctor-patients-test-results-orchestrator.impl';
import { QueryBus } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { Test } from '@nestjs/testing';
import { TestResultNotFoundException } from '../../../domain/exceptions/test-result-not-found.exception';
import { GetTestResultByIdQuery } from '../../../application/queries/get-test-result-by-id/get-test-result-by-id.query';
import { GetShortTestResultsByPatientIdQuery } from '../../../application/queries/get-short-test-results-by-patient-id/get-short-test-results-by-patient-id.query';
import { createTestResultDtoFixture } from '../../fixtures/test-result-dto.fixture';
import { createTestResultShortDtoFixture } from '../../fixtures/test-result-short-dto.fixture';

describe(DoctorPatientsTestResultsOrchestratorImpl.name, () => {
  let orchestrator: DoctorPatientsTestResultsOrchestratorImpl;

  let queryBus: Pick<jest.Mocked<QueryBus>, 'execute'>;

  const mockTestResultId = randomUUID();
  const mockPatientId = randomUUID();

  const mockTestResultDto = createTestResultDtoFixture({
    id: mockTestResultId,
    completedByPatientId: mockPatientId,
  });
  const mockTestResultShortDtos = [
    createTestResultShortDtoFixture(),
    createTestResultShortDtoFixture(),
  ];

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DoctorPatientsTestResultsOrchestratorImpl,
        {
          provide: QueryBus,
          useValue: <typeof queryBus>{
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    orchestrator = module.get(DoctorPatientsTestResultsOrchestratorImpl);
    queryBus = module.get(QueryBus);
  });

  describe('getTestResultById', () => {
    it('should return test result dto when found', async () => {
      queryBus.execute.mockResolvedValue(mockTestResultDto);

      const result = await orchestrator.getTestResultById(mockTestResultId);

      expect(result).toEqual(mockTestResultDto);
    });

    it('should throw TestResultNotFoundException when test result not found', async () => {
      queryBus.execute.mockResolvedValue(null);

      await expect(
        orchestrator.getTestResultById(mockTestResultId),
      ).rejects.toThrow(TestResultNotFoundException);
    });

    it('calls the QueryBus with correct parameters', async () => {
      queryBus.execute.mockResolvedValue(mockTestResultDto);

      await orchestrator.getTestResultById(mockTestResultId);

      const queryCall = queryBus.execute.mock.calls[0][0];
      expect(queryCall).toBeInstanceOf(GetTestResultByIdQuery);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({ testResultId: mockTestResultId }),
      );
    });

    it('propagates errors from the QueryBus', async () => {
      const error = new Error('Query failed');
      queryBus.execute.mockRejectedValue(error);

      await expect(
        orchestrator.getTestResultById(mockTestResultId),
      ).rejects.toThrow(error);
    });
  });

  describe('getTestResultsByPatientId', () => {
    it('should return test result short dtos array', async () => {
      const expectedResult = mockTestResultShortDtos;
      queryBus.execute.mockResolvedValue(expectedResult);

      const result =
        await orchestrator.getTestResultsByPatientId(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('should return empty array when no test results found', async () => {
      const expectedResult: TestResultShortDto[] = [];
      queryBus.execute.mockResolvedValue(expectedResult);

      const result =
        await orchestrator.getTestResultsByPatientId(mockPatientId);

      expect(result).toEqual(expectedResult);
    });

    it('calls the QueryBus with correct parameters', async () => {
      queryBus.execute.mockResolvedValue(mockTestResultShortDtos);

      await orchestrator.getTestResultsByPatientId(mockPatientId);

      const queryCall = queryBus.execute.mock.calls[0][0];
      expect(queryCall).toBeInstanceOf(GetShortTestResultsByPatientIdQuery);
      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({ patientId: mockPatientId }),
      );
    });

    it('propagates errors from the QueryBus', async () => {
      const error = new Error('Query failed');
      queryBus.execute.mockRejectedValue(error);

      await expect(
        orchestrator.getTestResultsByPatientId(mockPatientId),
      ).rejects.toThrow(error);
    });
  });
});
