import { TypeOrmAssignedTestsRepository } from '../../domain/infrastructure/typeorm/typeorm-assigned-tests.repository';
import { AssignedTest } from '../../domain/entities/assigned-test.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PaginateProps,
  TypeOrmPaginator,
} from '../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';
import { randomUUID } from 'node:crypto';
import { PaginationParams } from '../../../shared/pagination/domain/types/pagination-params.type';
import { DbPaginated } from '../../../shared/pagination/domain/types/db-paginated.type';
import { createAssignedTestFixture } from '../fixtures/assigned-test.fixture';

const paginationParams: PaginationParams<AssignedTest> = {
  page: 0,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(TypeOrmAssignedTestsRepository.name, () => {
  let repository: TypeOrmAssignedTestsRepository;

  const typeOrmRepo: Pick<
    jest.Mocked<Repository<AssignedTest>>,
    'findOneBy' | 'findBy' | 'save' | 'update' | 'target'
  > = {
    findOneBy: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    target: AssignedTest,
  };
  const paginator: Pick<jest.Mocked<TypeOrmPaginator>, 'paginate'> = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmAssignedTestsRepository,
        {
          provide: DataSource,
          useValue: {
            getRepository: () => typeOrmRepo,
          },
        },
        {
          provide: TypeOrmPaginator,
          useValue: paginator,
        },
      ],
    }).compile();

    repository = module.get(TypeOrmAssignedTestsRepository);
  });

  describe('getById', () => {
    it('should return the assigned test for a given ID', async () => {
      const assignedTestId = randomUUID();
      const expectedAssignedTest = createAssignedTestFixture();
      typeOrmRepo.findOneBy.mockResolvedValue(expectedAssignedTest);

      const result = await repository.getById(assignedTestId);

      expect(result).toEqual(expectedAssignedTest);
    });

    it('should return null if no assigned test is found', async () => {
      const assignedTestId = randomUUID();
      typeOrmRepo.findOneBy.mockResolvedValue(null);

      const result = await repository.getById(assignedTestId);

      expect(result).toBeNull();
    });

    it('should call typeOrmRepo.findOneBy with correct parameters', async () => {
      const assignedTestId = randomUUID();

      await repository.getById(assignedTestId);

      expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({
        id: assignedTestId,
      });
    });
  });

  describe('getAssignedTestByTestIdAndPatientId', () => {
    it('should return the assigned test for given test and patient IDs', async () => {
      const testId = randomUUID();
      const patientId = randomUUID();
      const expectedAssignedTest = createAssignedTestFixture();
      typeOrmRepo.findOneBy.mockResolvedValue(expectedAssignedTest);

      const result = await repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );

      expect(result).toEqual(expectedAssignedTest);
    });

    it('should return null if no assigned test is found', async () => {
      const testId = randomUUID();
      const patientId = randomUUID();
      typeOrmRepo.findOneBy.mockResolvedValue(null);

      const result = await repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );

      expect(result).toBeNull();
    });

    it('should call typeOrmRepo.findOneBy with correct parameters', async () => {
      const testId = randomUUID();
      const patientId = randomUUID();

      await repository.getAssignedTestByTestIdAndPatientId(testId, patientId);

      expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({
        testId: testId,
        assignedToPatientId: patientId,
        unassignedAt: IsNull(),
      });
    });
  });

  describe('getAssignedTestsByPatientId', () => {
    it('should return the assigned tests for a given patient ID', async () => {
      const patientId = randomUUID();
      const expectedAssignedTests = [
        createAssignedTestFixture(),
        createAssignedTestFixture(),
      ];
      typeOrmRepo.findBy.mockResolvedValue(expectedAssignedTests);

      const result = await repository.getAssignedTestsByPatientId(patientId);

      expect(result).toEqual(expectedAssignedTests);
    });

    it('should call typeOrmRepo.findBy with correct parameters', async () => {
      const patientId = randomUUID();

      await repository.getAssignedTestsByPatientId(patientId);

      expect(typeOrmRepo.findBy).toHaveBeenCalledWith({
        assignedToPatientId: patientId,
        unassignedAt: IsNull(),
      });
    });
  });

  describe('getAssignedTestsByDoctorId', () => {
    it('should return paginated assigned tests for a given doctor ID', async () => {
      const doctorId = randomUUID();
      const expectedResult: DbPaginated<AssignedTest> = {
        items: [createAssignedTestFixture(), createAssignedTestFixture()],
        totalCount: 2,
      };
      paginator.paginate.mockResolvedValue(expectedResult);

      const result = await repository.getAssignedTestsByDoctorId(
        doctorId,
        paginationParams,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should call paginator.paginate with correct parameters', async () => {
      const doctorId = randomUUID();

      await repository.getAssignedTestsByDoctorId(doctorId, paginationParams);

      expect(paginator.paginate).toHaveBeenCalledWith(<
        PaginateProps<AssignedTest>
      >{
        model: typeOrmRepo.target,
        paginationParams: paginationParams,
        where: { assignedByDoctorId: doctorId },
        include: {
          assignedToPatient: true,
        },
      });
    });
  });

  describe('createTest', () => {
    it('should create and return the assigned test', async () => {
      const assignedTest = createAssignedTestFixture();
      typeOrmRepo.save.mockResolvedValue(assignedTest);

      const result = await repository.createTest(assignedTest);

      expect(result).toEqual(assignedTest);
    });

    it('should call typeOrmRepo.save with the assigned test', async () => {
      const assignedTest = createAssignedTestFixture();

      await repository.createTest(assignedTest);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(assignedTest);
    });
  });

  describe('unassignTest', () => {
    it('should set unassignedAt to current date and return the updated assigned test', async () => {
      const assignedTest = createAssignedTestFixture({ unassignedAt: null });
      typeOrmRepo.save.mockResolvedValue(assignedTest);

      const result = await repository.unassignTest(assignedTest);

      expect(result).toEqual(assignedTest);
      expect(assignedTest.unassignedAt).toBeInstanceOf(Date);
    });

    it('should call typeOrmRepo.save with the updated assigned test', async () => {
      const assignedTest = createAssignedTestFixture();

      await repository.unassignTest(assignedTest);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(assignedTest);
    });
  });

  describe('unassignTestsByPatientIdAndDoctorId', () => {
    it('should call typeOrmRepo.update with correct parameters', async () => {
      const patientId = randomUUID();
      const doctorId = randomUUID();

      await repository.unassignTestsByPatientIdAndDoctorId(patientId, doctorId);

      const updateCall = typeOrmRepo.update.mock.calls[0];
      expect(updateCall[0]).toEqual({
        assignedToPatientId: patientId,
        assignedByDoctorId: doctorId,
        unassignedAt: IsNull(),
      });
      expect(updateCall[1].unassignedAt).toBeInstanceOf(Date);
    });
  });

  describe('unassignTestsByPatientId', () => {
    it('should call typeOrmRepo.update with correct parameters', async () => {
      const patientId = randomUUID();

      await repository.unassignTestsByPatientId(patientId);

      const updateCall = typeOrmRepo.update.mock.calls[0];
      expect(updateCall[0]).toEqual({
        assignedToPatientId: patientId,
        unassignedAt: IsNull(),
      });
      expect(updateCall[1].unassignedAt).toBeInstanceOf(Date);
    });
  });

  describe('unassignTestsByDoctorId', () => {
    it('should call typeOrmRepo.update with correct parameters', async () => {
      const doctorId = randomUUID();

      await repository.unassignTestsByDoctorId(doctorId);

      const updateCall = typeOrmRepo.update.mock.calls[0];
      expect(updateCall[0]).toEqual({
        assignedByDoctorId: doctorId,
        unassignedAt: IsNull(),
      });
      expect(updateCall[1].unassignedAt).toBeInstanceOf(Date);
    });
  });
});
