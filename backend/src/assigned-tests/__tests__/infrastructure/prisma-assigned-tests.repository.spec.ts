import { PrismaAssignedTestsRepository } from '../../domain/infrastructure/prisma/prisma-assigned-tests.repository';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../shared/pagination/prisma-applier/prisma-paginator.service';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { createAssignedTestFixture } from '../fixtures/assigned-test.fixture';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';
import { AssignedTest } from '../../domain/entities/assigned-test.entity';
import { DbPaginated } from '../../../shared/pagination/types/db-paginated.type';

describe(PrismaAssignedTestsRepository.name, () => {
  let repository: PrismaAssignedTestsRepository;

  const prismaAssignedTestsService: Pick<
    jest.Mocked<PrismaService['assignedTest']>,
    'findFirst' | 'findMany' | 'count' | 'create' | 'update' | 'updateMany'
  > = {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  };

  const prismaPaginator: Pick<
    jest.Mocked<PrismaPaginator>,
    'applyPagination'
  > = {
    applyPagination: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaAssignedTestsRepository,
        {
          provide: PrismaService,
          useValue: {
            assignedTest: prismaAssignedTestsService,
          },
        },
        {
          provide: PrismaPaginator,
          useValue: prismaPaginator,
        },
      ],
    }).compile();

    repository = module.get(PrismaAssignedTestsRepository);
  });

  describe('getById', () => {
    it('should return null if assigned test not found', async () => {
      prismaAssignedTestsService.findFirst.mockResolvedValueOnce(null);

      const result = await repository.getById(randomUUID());
      expect(result).toBeNull();
    });

    it('should return assigned test if found', async () => {
      const assignedTest = createAssignedTestFixture();
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.findFirst.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      const result = await repository.getById(assignedTest.id);
      expect(result).toEqual(prismaAssignedTest);
    });

    it('should call prisma with correct params', async () => {
      const assignedTestId = randomUUID();

      await repository.getById(assignedTestId);

      expect(prismaAssignedTestsService.findFirst).toHaveBeenCalledWith({
        where: { id: assignedTestId },
      });
    });
  });

  describe('getAssignedTestByTestIdAndPatientId', () => {
    it('should return null if assigned test not found', async () => {
      const testId = randomUUID();
      const patientId = randomUUID();
      prismaAssignedTestsService.findFirst.mockResolvedValueOnce(null);

      const result = await repository.getAssignedTestByTestIdAndPatientId(
        testId,
        patientId,
      );
      expect(result).toBeNull();
    });

    it('should return assigned test if found', async () => {
      const assignedTest = createAssignedTestFixture();
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.findFirst.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      const result = await repository.getAssignedTestByTestIdAndPatientId(
        assignedTest.testId,
        assignedTest.assignedToPatientId,
      );
      expect(result).toEqual(prismaAssignedTest);
    });

    it('should call prisma with correct params', async () => {
      const testId = randomUUID();
      const patientId = randomUUID();

      await repository.getAssignedTestByTestIdAndPatientId(testId, patientId);

      expect(prismaAssignedTestsService.findFirst).toHaveBeenCalledWith({
        where: {
          testId: testId,
          assignedToPatientId: patientId,
          unassignedAt: null,
        },
      });
    });
  });

  describe('getAssignedTestsByPatientId', () => {
    it('should return assigned tests for a patient', async () => {
      const patientId = randomUUID();
      const assignedTests = [
        createAssignedTestFixture(),
        createAssignedTestFixture(),
      ];
      const prismaAssignedTests = assignedTests.map((at) => at.toPersistence());
      prismaAssignedTestsService.findMany.mockResolvedValueOnce(
        prismaAssignedTests,
      );

      const result = await repository.getAssignedTestsByPatientId(patientId);

      expect(result).toEqual(assignedTests);
    });

    it('should return empty array if no assigned tests for a patient', async () => {
      const patientId = randomUUID();
      prismaAssignedTestsService.findMany.mockResolvedValueOnce([]);

      const result = await repository.getAssignedTestsByPatientId(patientId);

      expect(result).toEqual([]);
    });

    it('should call prisma with correct params', async () => {
      const patientId = randomUUID();
      prismaAssignedTestsService.findMany.mockResolvedValueOnce([]);

      await repository.getAssignedTestsByPatientId(patientId);

      expect(prismaAssignedTestsService.findMany).toHaveBeenCalledWith({
        where: { assignedToPatientId: patientId, unassignedAt: null },
      });
    });
  });

  describe('getAssignedTestsByDoctorId', () => {
    const paginationParams: PaginationParams<AssignedTest> = {
      page: 1,
      pageSize: 10,
      sortedFields: [],
      quickFilters: null,
      filters: null,
    };

    it('should return assigned tests for a doctor', async () => {
      const doctorId = randomUUID();
      const dbPaginatedAssignedTests: DbPaginated<AssignedTest> = {
        items: [createAssignedTestFixture(), createAssignedTestFixture()],
        totalCount: 2,
      };
      prismaPaginator.applyPagination.mockResolvedValueOnce(
        dbPaginatedAssignedTests,
      );

      const result = await repository.getAssignedTestsByDoctorId(
        doctorId,
        paginationParams,
      );

      expect(result).toEqual(dbPaginatedAssignedTests);
    });

    it('calls prismaPaginator with correct params', async () => {
      const doctorId = randomUUID();
      const dbPaginatedAssignedTests: DbPaginated<AssignedTest> = {
        items: [],
        totalCount: 0,
      };
      prismaPaginator.applyPagination.mockResolvedValueOnce(
        dbPaginatedAssignedTests,
      );

      await repository.getAssignedTestsByDoctorId(doctorId, paginationParams);
      const findMany = prismaPaginator.applyPagination.mock.calls[0][0];
      const count = prismaPaginator.applyPagination.mock.calls[0][1];
      await findMany({
        where: { assignedByDoctorId: doctorId },
        orderBy: {},
        skip: 0,
        take: 10,
      });
      await count({
        where: { assignedByDoctorId: doctorId },
      });

      expect(prismaPaginator.applyPagination).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        paginationParams,
        [],
        {
          assignedByDoctorId: doctorId,
        },
      );
      expect(prismaAssignedTestsService.findMany).toHaveBeenCalledWith({
        where: { assignedByDoctorId: doctorId },
        orderBy: {},
        skip: 0,
        take: 10,
      });
      expect(prismaAssignedTestsService.count).toHaveBeenCalledWith({
        where: { assignedByDoctorId: doctorId },
      });
    });
  });

  describe('createTest', () => {
    it('should return a new assigned test', async () => {
      const assignedTest = createAssignedTestFixture();
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.create.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      const result = await repository.createTest(assignedTest);

      expect(result).toEqual(assignedTest);
    });

    it('should call prisma with correct params', async () => {
      const assignedTest = createAssignedTestFixture();
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.create.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      await repository.createTest(assignedTest);

      expect(prismaAssignedTestsService.create).toHaveBeenCalledWith({
        data: assignedTest.toPersistence(),
      });
    });
  });

  describe('unassignTest', () => {
    it('should return the updated assigned test', async () => {
      const assignedTest = createAssignedTestFixture({
        unassignedAt: new Date(),
      });
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.update.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      const result = await repository.unassignTest(assignedTest);

      expect(result).toEqual(assignedTest);
    });

    it('should call prisma with correct params', async () => {
      const now = new Date();
      const assignedTest = createAssignedTestFixture({
        unassignedAt: now,
      });
      const prismaAssignedTest = assignedTest.toPersistence();
      prismaAssignedTestsService.update.mockResolvedValueOnce(
        prismaAssignedTest,
      );

      await repository.unassignTest(assignedTest);

      expect(prismaAssignedTestsService.update).toHaveBeenCalledWith({
        where: { id: assignedTest.id },
        data: { unassignedAt: now },
      });
    });
  });

  describe('unassignTestsByPatientIdAndDoctorId', () => {
    it('should return void if tests were unassigned successfully', async () => {
      const patientId = randomUUID();
      const doctorId = randomUUID();

      await expect(
        repository.unassignTestsByPatientIdAndDoctorId(patientId, doctorId),
      ).resolves.toBeUndefined();
    });

    it('should call prisma with correct params', async () => {
      const patientId = randomUUID();
      const doctorId = randomUUID();
      const now = new Date();

      await repository.unassignTestsByPatientIdAndDoctorId(patientId, doctorId);

      expect(prismaAssignedTestsService.updateMany).toHaveBeenCalledWith({
        where: {
          assignedToPatientId: patientId,
          assignedByDoctorId: doctorId,
          unassignedAt: null,
        },
        data: { unassignedAt: now },
      });
    });
  });

  describe('unassignTestsByPatientId', () => {
    it('should return void if tests were unassigned successfully', async () => {
      const patientId = randomUUID();

      await expect(
        repository.unassignTestsByPatientId(patientId),
      ).resolves.toBeUndefined();
    });

    it('should call prisma with correct params', async () => {
      const patientId = randomUUID();
      const now = new Date();

      await repository.unassignTestsByPatientId(patientId);

      expect(prismaAssignedTestsService.updateMany).toHaveBeenCalledWith({
        where: {
          assignedToPatientId: patientId,
          unassignedAt: null,
        },
        data: { unassignedAt: now },
      });
    });
  });

  describe('unassignTestsByDoctorId', () => {
    it('should return void if tests were unassigned successfully', async () => {
      const doctorId = randomUUID();

      await expect(
        repository.unassignTestsByDoctorId(doctorId),
      ).resolves.toBeUndefined();
    });

    it('should call prisma with correct params', async () => {
      const doctorId = randomUUID();
      const now = new Date();

      await repository.unassignTestsByDoctorId(doctorId);

      expect(prismaAssignedTestsService.updateMany).toHaveBeenCalledWith({
        where: {
          assignedByDoctorId: doctorId,
          unassignedAt: null,
        },
        data: { unassignedAt: now },
      });
    });
  });
});
