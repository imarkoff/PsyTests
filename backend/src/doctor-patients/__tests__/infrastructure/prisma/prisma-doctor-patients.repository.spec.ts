import { PrismaDoctorPatientsRepository } from '../../../infrastructure/prisma/prisma-doctor-patients.repository';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../../shared/pagination/prisma-applier/prisma-paginator.service';
import { Test } from '@nestjs/testing';
import { DbPaginated } from '../../../../shared/pagination/types/db-paginated.type';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { randomUUID } from 'node:crypto';
import { PaginationParams } from '../../../../shared/pagination/types/pagination-params.type';
import useRealTimers = jest.useRealTimers;

describe(PrismaDoctorPatientsRepository.name, () => {
  let repository: PrismaDoctorPatientsRepository;
  const systemTime = new Date('2024-01-01T00:00:00Z');

  const doctorPatientPrismaService: Pick<
    jest.Mocked<PrismaService['doctorPatient']>,
    | 'findMany'
    | 'count'
    | 'findFirst'
    | 'create'
    | 'update'
    | 'updateMany'
    | 'delete'
    | 'deleteMany'
  > = {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  };

  const prismaPaginator: Pick<
    jest.Mocked<PrismaPaginator>,
    'applyPagination'
  > = {
    applyPagination: jest.fn(),
  };

  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(systemTime);
  });

  afterAll(() => {
    useRealTimers();
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaDoctorPatientsRepository,
        {
          provide: PrismaService,
          useValue: {
            doctorPatient: doctorPatientPrismaService,
          },
        },
        { provide: PrismaPaginator, useValue: prismaPaginator },
      ],
    }).compile();

    repository = module.get(PrismaDoctorPatientsRepository);
  });

  describe('getAssignedPatientsByDoctorId', () => {
    const paginationParams: PaginationParams<DoctorPatient> = {
      page: 0,
      pageSize: 10,
      sortedFields: [],
      quickFilters: null,
      filters: null,
    };

    it('should fetch assigned patients by doctor ID with pagination', async () => {
      const doctorId = randomUUID();
      const expectedResult: DbPaginated<DoctorPatient> = {
        items: [createDoctorPatientFixture()],
        totalCount: 1,
      };

      prismaPaginator.applyPagination.mockResolvedValue(expectedResult);

      const result = await repository.getAssignedPatientsByDoctorId(
        doctorId,
        paginationParams,
      );

      expect(result).toEqual({
        items: expectedResult.items,
        totalCount: expectedResult.totalCount,
      });
    });

    it('calls prismaPaginator with correct parameters', async () => {
      const doctorId = randomUUID();

      await repository.getAssignedPatientsByDoctorId(
        doctorId,
        paginationParams,
      );
      const prismaPaginatorCall = prismaPaginator.applyPagination.mock.calls[0];
      const findManyCall = prismaPaginatorCall[0];
      const countCall = prismaPaginatorCall[1];
      await findManyCall({
        where: undefined,
        orderBy: undefined,
        skip: 0,
        take: 10,
      });
      await countCall({ where: {} });

      expect(prismaPaginator.applyPagination).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        paginationParams,
        ['patientId', 'assignedAt', 'needsAttention'],
        {
          doctorId: doctorId,
          unassignedAt: null,
          deletedAt: null,
        },
        {
          patient: true,
        },
      );
      expect(doctorPatientPrismaService.findMany).toHaveBeenCalled();
      expect(doctorPatientPrismaService.count).toHaveBeenCalled();
    });
  });

  describe('getAssignedPatientByDoctorAndPatientId', () => {
    it('should fetch assigned patient by doctor ID and patient ID', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const expectedPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.findFirst.mockResolvedValue(expectedPatient);

      const result = await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toEqual(expectedPatient);
    });

    it('should return null if no assigned patient is found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      doctorPatientPrismaService.findFirst.mockResolvedValue(null);

      const result = await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toBeNull();
    });

    it('calls prismaService.findFirst with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();

      await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(doctorPatientPrismaService.findFirst).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: patientId,
          unassignedAt: null,
          deletedAt: null,
        },
      });
    });
  });

  describe('getPatientByDoctorAndPatientId', () => {
    it('should fetch patient by doctor ID and patient ID', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const expectedPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.findFirst.mockResolvedValue(expectedPatient);

      const result = await repository.getPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toEqual(expectedPatient);
    });

    it('should return null if no patient is found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      doctorPatientPrismaService.findFirst.mockResolvedValue(null);

      const result = await repository.getPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toBeNull();
    });

    it('calls prismaService.findFirst with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();

      await repository.getPatientByDoctorAndPatientId(doctorId, patientId);

      expect(doctorPatientPrismaService.findFirst).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: patientId,
          deletedAt: null,
        },
        orderBy: {
          assignedAt: 'desc',
        },
      });
    });
  });

  describe('getPatientsByDoctorAndPatientsIds', () => {
    it('should fetch patients by doctor ID and multiple patient IDs', async () => {
      const doctorId = randomUUID();
      const patientIds = [randomUUID(), randomUUID()];
      const expectedPatients = [
        createDoctorPatientFixture({ patientId: patientIds[0] }),
        createDoctorPatientFixture({ patientId: patientIds[1] }),
      ];
      doctorPatientPrismaService.findMany.mockResolvedValue(expectedPatients);

      const result = await repository.getPatientsByDoctorAndPatientsIds(
        doctorId,
        patientIds,
      );

      expect(result).toEqual(expectedPatients);
    });

    it('calls prismaService.findMany with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientIds = [randomUUID(), randomUUID()];
      doctorPatientPrismaService.findMany.mockResolvedValue([]);

      await repository.getPatientsByDoctorAndPatientsIds(doctorId, patientIds);

      expect(doctorPatientPrismaService.findMany).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: { in: patientIds },
          unassignedAt: null,
          deletedAt: null,
        },
      });
    });
  });

  describe('createDoctorPatient', () => {
    it('should create a new doctor-patient association', async () => {
      const doctorPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.create.mockResolvedValue(doctorPatient);

      const result = await repository.createDoctorPatient(doctorPatient);

      expect(result).toEqual(doctorPatient);
    });

    it('calls prismaService.create with correct parameters', async () => {
      const doctorPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.create.mockResolvedValue(doctorPatient);

      await repository.createDoctorPatient(doctorPatient);

      expect(doctorPatientPrismaService.create).toHaveBeenCalledWith({
        data: doctorPatient.toPersistence(),
        include: {
          patient: true,
        },
      });
    });
  });

  describe('deleteDoctorPatient', () => {
    it('should return void after deleting a doctor-patient association', async () => {
      const doctorPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.delete.mockResolvedValue(doctorPatient);

      const result = await repository.deleteDoctorPatient(doctorPatient);

      expect(result).toBeUndefined();
    });

    it('softly deletes a doctor-patient association by setting deletedAt', async () => {
      const doctorPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.update.mockResolvedValue(doctorPatient);

      await repository.deleteDoctorPatient(doctorPatient);

      expect(doctorPatientPrismaService.update).toHaveBeenCalledWith({
        where: { id: doctorPatient.id },
        data: { deletedAt: systemTime },
      });
    });

    it('does not calls prismaService.delete', async () => {
      const doctorPatient = createDoctorPatientFixture();
      doctorPatientPrismaService.update.mockResolvedValue(doctorPatient);

      await repository.deleteDoctorPatient(doctorPatient);

      expect(doctorPatientPrismaService.delete).not.toHaveBeenCalled();
    });
  });

  describe('deleteAllPatientsOfDoctor', () => {
    it('should soft delete all patients of a doctor', async () => {
      const doctorId = randomUUID();

      await repository.deleteAllPatientsOfDoctor(doctorId);

      expect(doctorPatientPrismaService.updateMany).toHaveBeenCalledWith({
        where: { doctorId: doctorId, deletedAt: null },
        data: { deletedAt: systemTime, unassignedAt: systemTime },
      });
    });
  });

  describe('deleteAllRelationsOfPatient', () => {
    it('should soft delete all relations of a patient', async () => {
      const patientId = randomUUID();

      await repository.deleteAllRelationsOfPatient(patientId);

      expect(doctorPatientPrismaService.updateMany).toHaveBeenCalledWith({
        where: { patientId: patientId, deletedAt: null },
        data: { deletedAt: systemTime, unassignedAt: systemTime },
      });
    });
  });

  describe('changeNeedsAttentionStatus', () => {
    it('should change the needsAttention status of a doctor-patient association', async () => {
      const doctorPatient = createDoctorPatientFixture();
      const needsAttention = true;
      const updatedDoctorPatient = { ...doctorPatient, needsAttention };
      doctorPatientPrismaService.update.mockResolvedValue(updatedDoctorPatient);

      const result = await repository.changeNeedsAttentionStatus(
        doctorPatient,
        needsAttention,
      );

      expect(result).toEqual(updatedDoctorPatient);
      expect(doctorPatientPrismaService.update).toHaveBeenCalledWith({
        where: { id: doctorPatient.id },
        data: { needsAttention: needsAttention },
      });
    });
  });

  describe('changeAssignedStatus', () => {
    it('should change the assigned status to unassigned', async () => {
      const doctorPatient = createDoctorPatientFixture();
      const isAssigned = false;
      const updatedDoctorPatient = {
        ...doctorPatient,
        unassignedAt: systemTime,
      };
      doctorPatientPrismaService.update.mockResolvedValue(updatedDoctorPatient);

      const result = await repository.changeAssignedStatus(
        doctorPatient,
        isAssigned,
      );

      expect(result).toEqual(updatedDoctorPatient);
      expect(doctorPatientPrismaService.update).toHaveBeenCalledWith({
        where: { id: doctorPatient.id },
        data: { unassignedAt: systemTime },
      });
    });

    it('should change the assigned status to assigned', async () => {
      const doctorPatient = createDoctorPatientFixture({
        unassignedAt: new Date(),
      });
      const isAssigned = true;
      const updatedDoctorPatient = { ...doctorPatient, unassignedAt: null };
      doctorPatientPrismaService.update.mockResolvedValue(updatedDoctorPatient);

      const result = await repository.changeAssignedStatus(
        doctorPatient,
        isAssigned,
      );

      expect(result).toEqual(updatedDoctorPatient);
      expect(doctorPatientPrismaService.update).toHaveBeenCalledWith({
        where: { id: doctorPatient.id },
        data: { unassignedAt: null },
      });
    });
  });
});
