import { TypeOrmTestResultsRepository } from '../../infrastructure/typeorm/typeorm-test-results.repository';
import { DataSource, FindOptions, Repository } from 'typeorm';
import { TestResult } from '../../domain/entities/test-result.entity';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { createTestResultFixture } from '../fixtures/test-result.fixture';
import { SortDirection } from '../../../shared/pagination/domain/enums/sort-direction.enum';

describe(TypeOrmTestResultsRepository.name, () => {
  let repository: TypeOrmTestResultsRepository;

  const typeOrmTestResults: Pick<
    jest.Mocked<Repository<TestResult>>,
    'find' | 'findOne' | 'save'
  > = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        TypeOrmTestResultsRepository,
        {
          provide: DataSource,
          useValue: {
            getRepository: () => typeOrmTestResults,
          },
        },
      ],
    }).compile();

    repository = module.get<TypeOrmTestResultsRepository>(
      TypeOrmTestResultsRepository,
    );
  });

  describe('getByPatientIdDesc', () => {
    it('propagates results from TypeORM repository', async () => {
      const patientId = randomUUID();
      const results = [createTestResultFixture(), createTestResultFixture()];
      typeOrmTestResults.find.mockResolvedValue(results);

      const received = await repository.getByPatientIdDesc(patientId);

      expect(received).toBe(results);
    });

    it('correctly calls TypeORM find with correct parameters', async () => {
      const patientId = randomUUID();
      typeOrmTestResults.find.mockResolvedValue([]);

      await repository.getByPatientIdDesc(patientId);

      expect(typeOrmTestResults.find).toHaveBeenCalledTimes(1);
      expect(typeOrmTestResults.find).toHaveBeenCalledWith(
        expect.objectContaining(<FindOptions<TestResult>>{
          where: { completedByPatientId: patientId },
          order: {
            completedAt: SortDirection.DESC,
          },
        }),
      );
    });

    it('returns an empty array when no results exist for the patient', async () => {
      const patientId = randomUUID();
      typeOrmTestResults.find.mockResolvedValue([]);

      const received = await repository.getByPatientIdDesc(patientId);

      expect(typeOrmTestResults.find).toHaveBeenCalledTimes(1);
      expect(received).toEqual([]);
    });
  });

  describe('getById', () => {
    it('calls TypeORM findOne with correct parameters', async () => {
      const testResult = createTestResultFixture();
      typeOrmTestResults.findOne.mockResolvedValue(testResult);

      await repository.getById(testResult.id);

      expect(typeOrmTestResults.findOne).toHaveBeenCalledTimes(1);
      expect(typeOrmTestResults.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: testResult.id },
          relations: { completedByPatient: true },
        }),
      );
    });

    it('returns the test result when it exists including relations', async () => {
      const testResult = createTestResultFixture();
      typeOrmTestResults.findOne.mockResolvedValue(testResult);

      const received = await repository.getById(testResult.id);

      expect(received).toBe(testResult);
    });

    it('returns null when the test result does not exist', async () => {
      const testResultId = randomUUID();
      typeOrmTestResults.findOne.mockResolvedValue(null);

      const received = await repository.getById(testResultId);

      expect(typeOrmTestResults.findOne).toHaveBeenCalledTimes(1);
      expect(received).toBeNull();
    });
  });

  describe('create', () => {
    it('saves and returns the created test result', async () => {
      const newResult = createTestResultFixture();
      typeOrmTestResults.save.mockResolvedValue(newResult);

      const received = await repository.create(newResult);

      expect(typeOrmTestResults.save).toHaveBeenCalledTimes(1);
      expect(typeOrmTestResults.save).toHaveBeenCalledWith(newResult);
      expect(received).toBe(newResult);
    });
  });

  describe('update', () => {
    it('saves and returns the updated test result', async () => {
      const updated = createTestResultFixture();
      typeOrmTestResults.save.mockResolvedValue(updated);

      const received = await repository.update(updated);

      expect(typeOrmTestResults.save).toHaveBeenCalledTimes(1);
      expect(typeOrmTestResults.save).toHaveBeenCalledWith(updated);
      expect(received).toBe(updated);
    });
  });
});
