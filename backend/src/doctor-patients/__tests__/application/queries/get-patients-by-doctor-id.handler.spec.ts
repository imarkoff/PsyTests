import { GetPatientsByDoctorIdHandler } from '../../../application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.handler';
import { DoctorPatientsRepository } from '../../../domain/interfaces/doctor-patients.repository';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { createDoctorPatientFixture } from '../../fixtures/doctor-patient.fixture';
import { DbPaginated } from '../../../../shared/pagination/domain/types/db-paginated.type';
import { DoctorPatient } from '../../../domain/entities/doctor-patient.entity';
import { PaginationParams } from '../../../../shared/pagination/domain/types/pagination-params.type';
import { GetPatientsByDoctorIdQuery } from '../../../application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.query';
import { DoctorPatientMapper } from '../../../application/mappers/doctor-patient.mapper';
import { PaginatedList } from '../../../../shared/pagination/domain/types/paginated-list.type';
import { DoctorPatientDto } from '../../../presentation/dtos/doctor-patient.dto';

describe(GetPatientsByDoctorIdHandler.name, () => {
  let handler: GetPatientsByDoctorIdHandler;

  const repository: Pick<
    jest.Mocked<DoctorPatientsRepository>,
    'getAssignedPatientsByDoctorId'
  > = {
    getAssignedPatientsByDoctorId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [
        GetPatientsByDoctorIdHandler,
        {
          provide: DoctorPatientsRepository,
          useValue: repository,
        },
      ],
    }).compile();

    handler = module.get(GetPatientsByDoctorIdHandler);
  });

  it('should return paginated list of doctor patients', async () => {
    const doctorId = randomUUID();
    const paginationParams: PaginationParams<DoctorPatient> = {
      page: 0,
      pageSize: 10,
      filters: null,
      quickFilters: null,
      sortedFields: [],
    };
    const doctorPatients = [
      createDoctorPatientFixture({ doctorId }),
      createDoctorPatientFixture({ doctorId }),
    ];
    const expectedDtos = doctorPatients.map((dp) =>
      DoctorPatientMapper.toDto(dp),
    );
    const dbPaginatedPatients: DbPaginated<DoctorPatient> = {
      items: doctorPatients,
      totalCount: 2,
    };
    repository.getAssignedPatientsByDoctorId.mockResolvedValue(
      dbPaginatedPatients,
    );

    const result = await handler.execute({
      doctorId,
      paginationParams,
    } as GetPatientsByDoctorIdQuery);

    expect(result).toEqual(
      expect.objectContaining<PaginatedList<DoctorPatientDto, DoctorPatient>>({
        items: expectedDtos,
        totalCount: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
        ...paginationParams,
      }),
    );
  });

  it('should call repository with correct parameters', async () => {
    const doctorId = randomUUID();
    const paginationParams: PaginationParams<DoctorPatient> = {
      page: 1,
      pageSize: 5,
      filters: null,
      quickFilters: null,
      sortedFields: [],
    };
    const dbPaginatedPatients: DbPaginated<DoctorPatient> = {
      items: [],
      totalCount: 0,
    };
    repository.getAssignedPatientsByDoctorId.mockResolvedValue(
      dbPaginatedPatients,
    );

    await handler.execute({
      doctorId,
      paginationParams,
    } as GetPatientsByDoctorIdQuery);

    expect(repository.getAssignedPatientsByDoctorId).toHaveBeenCalledWith(
      doctorId,
      paginationParams,
    );
  });
});
