import { PatientsFinderImpl } from '../../../application/services/patients-finder/patients-finder.impl';
import { QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserDto } from '../../../../users/presentation/dtos/user.dto';
import { PaginatedListMapper } from '../../../../shared/pagination/application/mappers/paginated-list.mapper';
import { UserMapper } from '../../../../users/application/mappers/user.mapper';
import { createUserPersistence } from '../../../../__tests__/fixtures/user.fixture';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { UserWithDoctorPatientInfoDto } from '../../../presentation/dtos/user-with-doctor-patient-info.dto';
import { GetPaginatedUsersByRoleQuery } from '../../../../users/application/queries/get-paginated-users-by-role/get-paginated-users-by-role.query';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { GetDoctorPatientsByDoctorIdAndPatientIdsQuery } from '../../../application/queries/get-doctor-patients-by-doctor-id-and-patient-ids/get-doctor-patients-by-doctor-id-and-patient-ids.query';

const paginationParams: PaginationParams<User> = {
  page: 0,
  pageSize: 10,
  quickFilters: null,
  filters: null,
  sortedFields: [],
};

describe(PatientsFinderImpl.name, () => {
  let service: PatientsFinderImpl;

  const queryBus: Pick<jest.Mocked<QueryBus>, 'execute'> = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        PatientsFinderImpl,
        {
          provide: QueryBus,
          useValue: queryBus,
        },
      ],
    }).compile();

    service = module.get(PatientsFinderImpl);
  });

  it('should return paginated list of patients with doctor patient info', async () => {
    const doctorId = randomUUID();
    const paginatedPatients = PaginatedListMapper.toDto<UserDto, User>(
      paginationParams,
      {
        items: [
          User.fromPersistence(createUserPersistence()),
          User.fromPersistence(createUserPersistence()),
        ],
        totalCount: 2,
      },
      (user) => UserMapper.toDto(user),
    );
    const foundDoctorPatients = paginatedPatients.items.map((p) =>
      DoctorPatientMapper.toDto(
        createDoctorPatientFixture({ patientId: p.id }),
      ),
    );
    queryBus.execute
      .mockResolvedValueOnce(paginatedPatients)
      .mockResolvedValueOnce(foundDoctorPatients);

    const result = await service.find(doctorId, paginationParams);

    expect(result).toEqual(expect.objectContaining(paginationParams));
    expect(result.items).toEqual(
      paginatedPatients.items.map(
        (patient, index): UserWithDoctorPatientInfoDto => ({
          ...patient,
          doctorPatientInfo: {
            id: foundDoctorPatients[index].id,
            assignedAt: foundDoctorPatients[index].assignedAt,
            needsAttention: foundDoctorPatients[index].needsAttention,
          },
        }),
      ),
    );
  });

  it('should return empty paginated list when no patients found', async () => {
    const doctorId = randomUUID();
    const paginatedPatients = PaginatedListMapper.toDto<UserDto, User>(
      paginationParams,
      {
        items: [],
        totalCount: 0,
      },
      (user) => UserMapper.toDto(user),
    );
    queryBus.execute.mockResolvedValueOnce(paginatedPatients);

    const result = await service.find(doctorId, paginationParams);

    expect(result).toEqual(paginatedPatients);
  });

  it('should propagate errors from QueryBus', async () => {
    const doctorId = randomUUID();
    const error = new Error('Database connection error');
    queryBus.execute.mockRejectedValueOnce(error);

    await expect(service.find(doctorId, paginationParams)).rejects.toThrow(
      error,
    );
  });

  it('should call GetPaginatedUsersByRoleQuery with correct parameters', async () => {
    const doctorId = randomUUID();
    const paginatedPatients = PaginatedListMapper.toDto<UserDto, User>(
      paginationParams,
      {
        items: [],
        totalCount: 0,
      },
      (user) => UserMapper.toDto(user),
    );
    queryBus.execute
      .mockResolvedValueOnce(paginatedPatients)
      .mockResolvedValueOnce([]);

    await service.find(doctorId, paginationParams);

    const firstCall = queryBus.execute.mock.calls[0][0];
    expect(firstCall).toBeInstanceOf(GetPaginatedUsersByRoleQuery);
    expect(firstCall).toMatchObject({
      role: UserRole.PATIENT,
      paginationParams,
    } as GetPaginatedUsersByRoleQuery);
  });

  it('should call GetDoctorPatientsByDoctorIdAndPatientIdsQuery with correct parameters', async () => {
    const doctorId = randomUUID();
    const patients = [
      User.fromPersistence(createUserPersistence()),
      User.fromPersistence(createUserPersistence()),
    ];
    const paginatedPatients = PaginatedListMapper.toDto<UserDto, User>(
      paginationParams,
      {
        items: patients,
        totalCount: 2,
      },
      (user) => UserMapper.toDto(user),
    );
    queryBus.execute
      .mockResolvedValueOnce(paginatedPatients)
      .mockResolvedValueOnce([]);

    await service.find(doctorId, paginationParams);

    const secondCall = queryBus.execute.mock.calls[1][0];
    expect(secondCall).toBeInstanceOf(
      GetDoctorPatientsByDoctorIdAndPatientIdsQuery,
    );
    expect(secondCall).toMatchObject({
      doctorId,
      patientIds: patients.map((p) => p.id),
    } as GetDoctorPatientsByDoctorIdAndPatientIdsQuery);
  });
});
