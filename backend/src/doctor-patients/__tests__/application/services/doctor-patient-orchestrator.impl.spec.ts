import { DoctorPatientOrchestratorImpl } from '../../../application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.impl';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { DoctorPatientCreator } from '../../../application/services/doctor-patient-creator/doctor-patient-creator.abstract';
import { randomUUID } from 'node:crypto';
import { PatientsFinder } from '../../../application/services/patients-finder/patients-finder.abstract';
import { DoctorPatientRemover } from '../../../application/services/doctor-patient-remover/doctor-patient-remover.abstract';
import { Test } from '@nestjs/testing';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { User } from '../../../../users/domain/entities/user.entity';
import { PaginatedList } from '../../../../shared/pagination/domain/types/paginated-list.type';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { GetPatientsByDoctorIdQuery } from '../../../application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.query';
import { GetPatientByIdAndDoctorIdQuery } from '../../../application/queries/get-patient-by-id-and-doctor-id/get-patient-by-id-and-doctor-id.query';
import { DoctorPatientNotFoundException } from '../../../domain/exceptions/doctor-patient-not-found.exception';
import { UserWithDoctorPatientInfoDto } from '../../../presentation/dtos/user-with-doctor-patient-info.dto';
import { AssignDoctorPatientCommand } from '../../../application/commands/assign-doctor-patient/assign-doctor-patient.command';
import { MarkDoctorPatientAsReadCommand } from '../../../application/commands/mark-doctor-patient-as-read/mark-doctor-patient-as-read.command';
import { createPatientCreateFixture } from '../../fixtures/patient-create.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';

const paginationParams: PaginationParams<object> = {
  page: 0,
  pageSize: 10,
  sortedFields: [],
  quickFilters: null,
  filters: null,
};

describe(DoctorPatientOrchestratorImpl.name, () => {
  let orchestrator: DoctorPatientOrchestratorImpl;

  const queryBus: Pick<jest.Mocked<QueryBus>, 'execute'> = {
    execute: jest.fn(),
  };
  const commandBus: Pick<jest.Mocked<CommandBus>, 'execute'> = {
    execute: jest.fn(),
  };
  const doctorPatientCreator: Pick<
    jest.Mocked<DoctorPatientCreator>,
    'createDoctorPatient'
  > = {
    createDoctorPatient: jest.fn(),
  };
  const patientsFinder: Pick<jest.Mocked<PatientsFinder>, 'find'> = {
    find: jest.fn(),
  };
  const doctorPatientRemover: Pick<
    jest.Mocked<DoctorPatientRemover>,
    'remove'
  > = {
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        DoctorPatientOrchestratorImpl,
        { provide: QueryBus, useValue: queryBus },
        { provide: CommandBus, useValue: commandBus },
        { provide: DoctorPatientCreator, useValue: doctorPatientCreator },
        { provide: PatientsFinder, useValue: patientsFinder },
        { provide: DoctorPatientRemover, useValue: doctorPatientRemover },
      ],
    }).compile();

    orchestrator = module.get(DoctorPatientOrchestratorImpl);
  });

  describe('getActivePatientsByDoctor', () => {
    it('should return paginated list of doctor patients', async () => {
      const doctorId = randomUUID();
      const paginatedPatients: PaginatedList<DoctorPatientDto, DoctorPatient> =
        {
          ...(paginationParams as PaginationParams<DoctorPatient>),
          items: [],
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      queryBus.execute.mockResolvedValueOnce(paginatedPatients);

      const result = await orchestrator.getActivePatientsByDoctor(
        doctorId,
        paginationParams,
      );

      expect(result).toBe(paginatedPatients);
    });

    it('should call queryBus.execute with GetPatientsByDoctorIdQuery', async () => {
      const doctorId = randomUUID();

      await orchestrator.getActivePatientsByDoctor(doctorId, paginationParams);

      const call = queryBus.execute.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetPatientsByDoctorIdQuery);
    });
  });

  describe('getDoctorPatientByDoctorAndPatientIds', () => {
    it('should return doctor patient if found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const doctorPatient = {} as DoctorPatientDto;
      queryBus.execute.mockResolvedValueOnce(doctorPatient);

      const result = await orchestrator.getDoctorPatientByDoctorAndPatientIds(
        doctorId,
        patientId,
      );

      expect(result).toBe(doctorPatient);
    });

    it('should call queryBus.execute with GetPatientByIdAndDoctorIdQuery', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      queryBus.execute.mockResolvedValueOnce({} as DoctorPatientDto);

      await orchestrator.getDoctorPatientByDoctorAndPatientIds(
        doctorId,
        patientId,
      );

      const call = queryBus.execute.mock.calls[0][0];
      expect(call).toBeInstanceOf(GetPatientByIdAndDoctorIdQuery);
      expect(call).toEqual(
        new GetPatientByIdAndDoctorIdQuery(doctorId, patientId),
      );
    });

    it('should throw DoctorPatientNotFoundException if doctor patient not found', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      queryBus.execute.mockResolvedValueOnce(null);

      await expect(
        orchestrator.getDoctorPatientByDoctorAndPatientIds(doctorId, patientId),
      ).rejects.toThrow(DoctorPatientNotFoundException);
    });
  });

  describe('findPatients', () => {
    it('should call patientsFinder.find with correct arguments and return its result', async () => {
      const doctorId = randomUUID();
      const paginatedUsers: PaginatedList<UserWithDoctorPatientInfoDto, User> =
        {
          ...(paginationParams as PaginationParams<User>),
          items: [],
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      patientsFinder.find.mockResolvedValueOnce(paginatedUsers);

      const result = await orchestrator.findPatients(
        doctorId,
        paginationParams,
      );

      expect(patientsFinder.find).toHaveBeenCalledWith(
        doctorId,
        paginationParams,
      );
      expect(result).toBe(paginatedUsers);
    });
  });

  describe('createNewPatientAndAssignToDoctor', () => {
    it('should call doctorPatientCreator.createDoctorPatient and return its result', async () => {
      const doctorId = randomUUID();
      const patientCreateDto = createPatientCreateFixture();
      const doctorPatient = DoctorPatientMapper.toDto(
        createDoctorPatientFixture(),
      );
      doctorPatientCreator.createDoctorPatient.mockResolvedValueOnce(
        doctorPatient,
      );

      const result = await orchestrator.createNewPatientAndAssignToDoctor(
        doctorId,
        patientCreateDto,
      );

      expect(doctorPatientCreator.createDoctorPatient).toHaveBeenCalledWith(
        doctorId,
        patientCreateDto,
      );
      expect(result).toBe(doctorPatient);
    });
  });

  describe('assignExistingPatientToDoctor', () => {
    it('should call commandBus.execute with AssignDoctorPatientCommand', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      const doctorPatient = {} as DoctorPatientDto;
      commandBus.execute.mockResolvedValueOnce(doctorPatient);

      const result = await orchestrator.assignExistingPatientToDoctor(
        doctorId,
        patientId,
      );

      const call = commandBus.execute.mock.calls[0][0];
      expect(call).toBeInstanceOf(AssignDoctorPatientCommand);
      expect(call).toEqual(new AssignDoctorPatientCommand(doctorId, patientId));
      expect(result).toBe(doctorPatient);
    });
  });

  describe('markDoctorPatientAsRead', () => {
    it('should call commandBus.execute with MarkDoctorPatientAsReadCommand', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      commandBus.execute.mockResolvedValueOnce(undefined);

      await orchestrator.markDoctorPatientAsRead(doctorId, patientId);

      const call = commandBus.execute.mock.calls[0][0];
      expect(call).toBeInstanceOf(MarkDoctorPatientAsReadCommand);
      expect(call).toEqual(
        new MarkDoctorPatientAsReadCommand(doctorId, patientId),
      );
    });
  });

  describe('unassignPatientFromDoctor', () => {
    it('should call doctorPatientRemover.remove with correct arguments', async () => {
      const doctorId = randomUUID();
      const patientId = randomUUID();
      doctorPatientRemover.remove.mockResolvedValueOnce(undefined);

      await orchestrator.unassignPatientFromDoctor(doctorId, patientId);

      expect(doctorPatientRemover.remove).toHaveBeenCalledWith(
        doctorId,
        patientId,
      );
    });
  });
});
