import { DoctorPatientsController } from '../../presentation/doctor-patients.controller';
import { DoctorPatientDto } from '../../presentation/dtos/doctor-patient.dto';
import { Test } from '@nestjs/testing';
import { DoctorPatientOrchestrator } from '../../application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.abstract';
import { PaginatedList } from '../../../shared/pagination/domain/types/paginated-list.type';
import { DoctorPatient } from '../../domain/entities/doctor-patient.entity';
import { createUserPersistence } from '../../../__tests__/fixtures/user.fixture';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { User } from '../../../users/domain/entities/user.entity';
import { QueryPaginationParamsDto } from '../../../shared/pagination/presentation/dtos/query-pagination-params.dto';
import { FilterOperator } from '../../../shared/pagination/domain/enums/filter-operator.enum';
import { PaginationParamsMapper } from '../../../shared/pagination/application/mappers/pagination-params.mapper';
import { UserWithDoctorPatientInfoDto } from '../../presentation/dtos/user-with-doctor-patient-info.dto';
import { PaginationException } from '../../../shared/pagination/domain/exceptions/pagination.exception';
import { randomUUID } from 'node:crypto';
import { DoctorPatientNotFoundException } from '../../domain/exceptions/doctor-patient-not-found.exception';
import { createPatientCreateFixture } from '../fixtures/patient-create.fixture';

describe(DoctorPatientsController.name, () => {
  let controller: DoctorPatientsController;

  const doctor = User.fromPersistence(
    createUserPersistence({ role: UserRole.DOCTOR }),
  );
  const queryPaginationParamsDto: QueryPaginationParamsDto = {
    page: 1,
    pageSize: 10,
    filtersOperator: FilterOperator.AND,
    quickFiltersOperator: FilterOperator.AND,
  };

  const doctorPatientOrchestrator: Omit<
    jest.Mocked<DoctorPatientOrchestrator>,
    ''
  > = {
    unassignPatientFromDoctor: jest.fn(),
    markDoctorPatientAsRead: jest.fn(),
    findPatients: jest.fn(),
    getDoctorPatientByDoctorAndPatientIds: jest.fn(),
    getActivePatientsByDoctor: jest.fn(),
    assignExistingPatientToDoctor: jest.fn(),
    createNewPatientAndAssignToDoctor: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [DoctorPatientsController],
      providers: [
        {
          provide: DoctorPatientOrchestrator,
          useValue: doctorPatientOrchestrator,
        },
      ],
    }).compile();

    controller = module.get(DoctorPatientsController);
  });

  describe('getPatientsByDoctor', () => {
    const paginationParams =
      PaginationParamsMapper.toPaginationParams<DoctorPatient>(
        queryPaginationParamsDto,
      );

    it('returns a paginated list of DoctorPatientDto', async () => {
      const expectedPaginatedList: PaginatedList<
        DoctorPatientDto,
        DoctorPatient
      > = {
        ...paginationParams,
        items: [],
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      doctorPatientOrchestrator.getActivePatientsByDoctor.mockResolvedValueOnce(
        expectedPaginatedList,
      );

      const result = await controller.getPatientsByDoctor(
        queryPaginationParamsDto,
        doctor,
      );

      expect(result).toEqual(expectedPaginatedList);
    });

    it('calls orchestrator.getActivePatientsByDoctor for getting patients', async () => {
      await controller.getPatientsByDoctor(queryPaginationParamsDto, doctor);

      expect(
        doctorPatientOrchestrator.getActivePatientsByDoctor,
      ).toHaveBeenCalledWith(doctor.id, paginationParams);
    });

    it('throws an error when orchestrator.getActivePatientsByDoctor fails', async () => {
      const error = new PaginationException('Pagination error');
      doctorPatientOrchestrator.getActivePatientsByDoctor.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.getPatientsByDoctor(queryPaginationParamsDto, doctor),
      ).rejects.toThrow(PaginationException);
    });
  });

  describe('findPatients', () => {
    const paginationParams = PaginationParamsMapper.toPaginationParams<User>(
      queryPaginationParamsDto,
    );

    it('returns a paginated list of UserWithDoctorPatientInfoDto', async () => {
      const expectedPaginatedList: PaginatedList<
        UserWithDoctorPatientInfoDto,
        User
      > = {
        ...paginationParams,
        items: [],
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
      doctorPatientOrchestrator.findPatients.mockResolvedValueOnce(
        expectedPaginatedList,
      );

      const result = await controller.findPatients(
        queryPaginationParamsDto,
        doctor,
      );

      expect(result).toEqual(expectedPaginatedList);
    });

    it('calls orchestrator.findPatients for finding patients', async () => {
      await controller.findPatients(queryPaginationParamsDto, doctor);

      expect(doctorPatientOrchestrator.findPatients).toHaveBeenCalledWith(
        doctor.id,
        paginationParams,
      );
    });

    it('throws an error when orchestrator.findPatients fails', async () => {
      const error = new PaginationException('Pagination error');
      doctorPatientOrchestrator.findPatients.mockRejectedValueOnce(error);

      await expect(
        controller.findPatients(queryPaginationParamsDto, doctor),
      ).rejects.toThrow(PaginationException);
    });
  });

  describe('getDoctorPatient', () => {
    it('returns the same DoctorPatientDto as returned by the orchestrator', async () => {
      const doctorPatientDto = new DoctorPatientDto();
      doctorPatientOrchestrator.getDoctorPatientByDoctorAndPatientIds.mockResolvedValueOnce(
        doctorPatientDto,
      );

      const result = await controller.getDoctorPatient(randomUUID(), doctor);

      expect(result).toBe(doctorPatientDto);
    });

    it('calls orchestrator.getDoctorPatientByDoctorAndPatientIds with correct parameters', async () => {
      const patientId = randomUUID();

      await controller.getDoctorPatient(patientId, doctor);

      expect(
        doctorPatientOrchestrator.getDoctorPatientByDoctorAndPatientIds,
      ).toHaveBeenCalledWith(doctor.id, patientId);
    });

    it('throws an error when orchestrator.getDoctorPatientByDoctorAndPatientIds fails', async () => {
      const patientId = randomUUID();
      const error = new DoctorPatientNotFoundException(doctor.id, patientId);
      doctorPatientOrchestrator.getDoctorPatientByDoctorAndPatientIds.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.getDoctorPatient(patientId, doctor),
      ).rejects.toThrow(DoctorPatientNotFoundException);
    });
  });

  describe('createDoctorPatient', () => {
    const patientCreateDto = createPatientCreateFixture();

    it('returns the same DoctorPatientDto as returned by the orchestrator', async () => {
      const doctorPatientDto = new DoctorPatientDto();
      doctorPatientOrchestrator.createNewPatientAndAssignToDoctor.mockResolvedValueOnce(
        doctorPatientDto,
      );

      const result = await controller.createDoctorPatient(
        patientCreateDto,
        doctor,
      );

      expect(result).toBe(doctorPatientDto);
    });

    it('calls orchestrator.createNewPatientAndAssignToDoctor with correct parameters', async () => {
      await controller.createDoctorPatient(patientCreateDto, doctor);

      expect(
        doctorPatientOrchestrator.createNewPatientAndAssignToDoctor,
      ).toHaveBeenCalledWith(doctor.id, patientCreateDto);
    });

    it('throws an error when orchestrator.createNewPatientAndAssignToDoctor fails', async () => {
      const error = new Error('Patient creation failed');
      doctorPatientOrchestrator.createNewPatientAndAssignToDoctor.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.createDoctorPatient(patientCreateDto, doctor),
      ).rejects.toThrow(error);
    });
  });

  describe('assignExistingPatient', () => {
    const patientId = randomUUID();

    it('returns the same DoctorPatientDto as returned by the orchestrator', async () => {
      const doctorPatientDto = new DoctorPatientDto();
      doctorPatientOrchestrator.assignExistingPatientToDoctor.mockResolvedValueOnce(
        doctorPatientDto,
      );

      const result = await controller.assignExistingPatient(patientId, doctor);

      expect(result).toBe(doctorPatientDto);
    });

    it('calls orchestrator.assignExistingPatientToDoctor with correct parameters', async () => {
      await controller.assignExistingPatient(patientId, doctor);

      expect(
        doctorPatientOrchestrator.assignExistingPatientToDoctor,
      ).toHaveBeenCalledWith(doctor.id, patientId);
    });

    it('throws an error when orchestrator.assignExistingPatientToDoctor fails', async () => {
      const error = new DoctorPatientNotFoundException(doctor.id, patientId);
      doctorPatientOrchestrator.assignExistingPatientToDoctor.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.assignExistingPatient(patientId, doctor),
      ).rejects.toThrow(DoctorPatientNotFoundException);
    });
  });

  describe('markPatientAsRead', () => {
    const patientId = randomUUID();

    it('calls orchestrator.markDoctorPatientAsRead with correct parameters', async () => {
      await controller.markPatientAsRead(patientId, doctor);

      expect(
        doctorPatientOrchestrator.markDoctorPatientAsRead,
      ).toHaveBeenCalledWith(doctor.id, patientId);
    });

    it('returns undefined on success', async () => {
      doctorPatientOrchestrator.markDoctorPatientAsRead.mockResolvedValueOnce(
        undefined,
      );

      const result = await controller.markPatientAsRead(patientId, doctor);

      expect(result).toBeUndefined();
    });

    it('throws an error when orchestrator.markDoctorPatientAsRead fails', async () => {
      const error = new DoctorPatientNotFoundException(doctor.id, patientId);
      doctorPatientOrchestrator.markDoctorPatientAsRead.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.markPatientAsRead(patientId, doctor),
      ).rejects.toThrow(DoctorPatientNotFoundException);
    });
  });

  describe('unassignPatient', () => {
    const patientId = randomUUID();

    it('calls orchestrator.unassignPatientFromDoctor with correct parameters', async () => {
      await controller.unassignPatient(patientId, doctor);

      expect(
        doctorPatientOrchestrator.unassignPatientFromDoctor,
      ).toHaveBeenCalledWith(doctor.id, patientId);
    });

    it('returns undefined on success', async () => {
      doctorPatientOrchestrator.unassignPatientFromDoctor.mockResolvedValueOnce(
        undefined,
      );

      const result = await controller.unassignPatient(patientId, doctor);

      expect(result).toBeUndefined();
    });

    it('throws an error when orchestrator.unassignPatientFromDoctor fails', async () => {
      const error = new DoctorPatientNotFoundException(doctor.id, patientId);
      doctorPatientOrchestrator.unassignPatientFromDoctor.mockRejectedValueOnce(
        error,
      );

      await expect(
        controller.unassignPatient(patientId, doctor),
      ).rejects.toThrow(DoctorPatientNotFoundException);
    });
  });
});
