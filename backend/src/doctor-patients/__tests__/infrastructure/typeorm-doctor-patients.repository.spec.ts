import { TypeOrmDoctorPatientsRepository } from '../../infrastructure/typeorm/typeorm-doctor-patients.repository';
import { DoctorPatient } from '../../domain/entities/doctor-patient.entity';
import { DataSource, IsNull, Repository, In } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  PaginateProps,
  TypeOrmPaginator,
} from '../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';
import { randomUUID } from 'node:crypto';
import { PaginationParams } from '../../../shared/pagination/domain/types/pagination-params.type';
import { DbPaginated } from '../../../shared/pagination/domain/types/db-paginated.type';
import { createDoctorPatientFixture } from '../fixtures/doctor-patient.fixture';

const paginationParams: PaginationParams<DoctorPatient> = {
  page: 0,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(TypeOrmDoctorPatientsRepository.name, () => {
  let repository: TypeOrmDoctorPatientsRepository;

  const typeOrmRepo: Pick<
    jest.Mocked<Repository<DoctorPatient>>,
    'findOne' | 'find' | 'save' | 'softDelete' | 'target'
  > = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    target: DoctorPatient,
  };
  const paginator: Pick<jest.Mocked<TypeOrmPaginator>, 'paginate'> = {
    paginate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmDoctorPatientsRepository,
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

    repository = module.get(TypeOrmDoctorPatientsRepository);
  });

  describe('getAssignedPatientsByDoctorId', () => {
    it('should return paginated assigned patients for a given doctor ID', async () => {
      const doctorId = randomUUID();
      const expectedResult: DbPaginated<DoctorPatient> = {
        items: [createDoctorPatientFixture(), createDoctorPatientFixture()],
        totalCount: 2,
      };
      paginator.paginate.mockResolvedValue(expectedResult);

      const result = await repository.getAssignedPatientsByDoctorId(
        doctorId,
        paginationParams,
      );

      expect(result).toEqual(expectedResult);
    });

    it('should call paginator.paginate with correct parameters', async () => {
      const doctorId = randomUUID();

      await repository.getAssignedPatientsByDoctorId(
        doctorId,
        paginationParams,
      );

      expect(paginator.paginate).toHaveBeenCalledWith(<
        PaginateProps<DoctorPatient>
      >{
        model: typeOrmRepo.target,
        paginationParams: paginationParams,
        where: {
          doctorId: doctorId,
          unassignedAt: IsNull(),
        },
        filterFields: [
          'patient.name',
          'patient.surname',
          'patient.patronymic',
          'patient.phone',
        ],
        include: {
          patient: true,
        },
      });
    });
  });

  describe('getAssignedPatientByDoctorAndPatientId', () => {
    it('should return the assigned patient for given doctor and patient IDs', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const expectedDoctorPatient = createDoctorPatientFixture();
      typeOrmRepo.findOne.mockResolvedValue(expectedDoctorPatient);

      const result = await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toEqual(expectedDoctorPatient);
    });

    it('should return null if no assigned patient is found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      typeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toBeNull();
    });

    it('should call typeOrmRepo.findOne with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();

      await repository.getAssignedPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: patientId,
          unassignedAt: IsNull(),
        },
        relations: {
          patient: true,
        },
      });
    });
  });

  describe('getPatientByDoctorAndPatientId', () => {
    it('should return the patient for given doctor and patient IDs', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const expectedDoctorPatient = createDoctorPatientFixture();
      typeOrmRepo.findOne.mockResolvedValue(expectedDoctorPatient);

      const result = await repository.getPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toEqual(expectedDoctorPatient);
    });

    it('should return null if no patient is found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      typeOrmRepo.findOne.mockResolvedValue(null);

      const result = await repository.getPatientByDoctorAndPatientId(
        doctorId,
        patientId,
      );

      expect(result).toBeNull();
    });

    it('should call typeOrmRepo.findOne with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();

      await repository.getPatientByDoctorAndPatientId(doctorId, patientId);

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: patientId,
        },
        relations: {
          patient: true,
        },
      });
    });
  });

  describe('getPatientsByDoctorAndPatientsIds', () => {
    it('should return the patients for given doctor and patients IDs', async () => {
      const doctorId = randomUUID();
      const patientsIds = [randomUUID(), randomUUID()];
      const expectedDoctorPatients = [
        createDoctorPatientFixture(),
        createDoctorPatientFixture(),
      ];
      typeOrmRepo.find.mockResolvedValue(expectedDoctorPatients);

      const result = await repository.getPatientsByDoctorAndPatientsIds(
        doctorId,
        patientsIds,
      );

      expect(result).toEqual(expectedDoctorPatients);
    });

    it('should call typeOrmRepo.find with correct parameters', async () => {
      const doctorId = randomUUID();
      const patientsIds = [randomUUID(), randomUUID()];

      await repository.getPatientsByDoctorAndPatientsIds(doctorId, patientsIds);

      expect(typeOrmRepo.find).toHaveBeenCalledWith({
        where: {
          doctorId: doctorId,
          patientId: In(patientsIds),
        },
        relations: {
          patient: true,
        },
      });
    });
  });

  describe('createDoctorPatient', () => {
    it('should create and return the doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture();
      typeOrmRepo.save.mockResolvedValue(doctorPatient);

      const result = await repository.createDoctorPatient(doctorPatient);

      expect(result).toEqual(doctorPatient);
    });

    it('should call typeOrmRepo.save with the doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture();

      await repository.createDoctorPatient(doctorPatient);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(doctorPatient);
    });
  });

  describe('deleteDoctorPatient', () => {
    it('should call typeOrmRepo.softDelete with the doctor patient id', async () => {
      const doctorPatient = createDoctorPatientFixture();

      await repository.deleteDoctorPatient(doctorPatient);

      expect(typeOrmRepo.softDelete).toHaveBeenCalledWith(doctorPatient.id);
    });
  });

  describe('deleteAllPatientsOfDoctor', () => {
    it('should call typeOrmRepo.softDelete with the doctor id', async () => {
      const doctorId = randomUUID();

      await repository.deleteAllPatientsOfDoctor(doctorId);

      expect(typeOrmRepo.softDelete).toHaveBeenCalledWith({ doctorId });
    });
  });

  describe('deleteAllRelationsOfPatient', () => {
    it('should call typeOrmRepo.softDelete with the patient id', async () => {
      const patientId = randomUUID();

      await repository.deleteAllRelationsOfPatient(patientId);

      expect(typeOrmRepo.softDelete).toHaveBeenCalledWith({ patientId });
    });
  });

  describe('changeNeedsAttentionStatus', () => {
    it('should change needsAttention status and return the updated doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture();
      const needsAttention = true;
      typeOrmRepo.save.mockResolvedValue(doctorPatient);

      const result = await repository.changeNeedsAttentionStatus(
        doctorPatient,
        needsAttention,
      );

      expect(result).toEqual(doctorPatient);
      expect(doctorPatient.needsAttention).toBe(needsAttention);
    });

    it('should call typeOrmRepo.save with the updated doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture();
      const needsAttention = false;

      await repository.changeNeedsAttentionStatus(
        doctorPatient,
        needsAttention,
      );

      expect(typeOrmRepo.save).toHaveBeenCalledWith(doctorPatient);
    });
  });

  describe('changeAssignedStatus', () => {
    it('should set unassignedAt to null when assigning and return the updated doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture({
        unassignedAt: new Date(),
      });
      const isAssigned = true;
      typeOrmRepo.save.mockResolvedValue(doctorPatient);

      const result = await repository.changeAssignedStatus(
        doctorPatient,
        isAssigned,
      );

      expect(result).toEqual(doctorPatient);
      expect(doctorPatient.unassignedAt).toBeNull();
    });

    it('should set unassignedAt to current date when unassigning and return the updated doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture({ unassignedAt: null });
      const isAssigned = false;
      typeOrmRepo.save.mockResolvedValue(doctorPatient);

      const result = await repository.changeAssignedStatus(
        doctorPatient,
        isAssigned,
      );

      expect(result).toEqual(doctorPatient);
      expect(doctorPatient.unassignedAt).toBeInstanceOf(Date);
    });

    it('should call typeOrmRepo.save with the updated doctor patient', async () => {
      const doctorPatient = createDoctorPatientFixture();
      const isAssigned = true;

      await repository.changeAssignedStatus(doctorPatient, isAssigned);

      expect(typeOrmRepo.save).toHaveBeenCalledWith(doctorPatient);
    });
  });
});
