import { UUID } from 'crypto';
import { DoctorPatient } from 'src/doctor-patients/domain/entities/doctor-patient.entity';
import { DbPaginated } from 'src/shared/pagination/domain/types/db-paginated.type';
import { PaginationParams } from 'src/shared/pagination/domain/types/pagination-params.type';
import { DoctorPatientsRepository } from '../../domain/interfaces/doctor-patients.repository';
import { Injectable } from '@nestjs/common';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { TypeOrmPaginator } from '../../../shared/pagination/application/typeorm-paginator/typeorm-paginator.abstract';

@Injectable()
export class TypeOrmDoctorPatientsRepository
  implements DoctorPatientsRepository
{
  private readonly repository: Repository<DoctorPatient>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly paginator: TypeOrmPaginator,
  ) {
    this.repository = this.dataSource.getRepository(DoctorPatient);
  }

  getAssignedPatientsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<DoctorPatient>,
  ): Promise<DbPaginated<DoctorPatient>> {
    return this.paginator.paginate({
      model: DoctorPatient,
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
  }

  getAssignedPatientByDoctorAndPatientId(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatient | null> {
    return this.repository.findOne({
      where: {
        doctorId: doctorId,
        patientId: patientId,
        unassignedAt: IsNull(),
      },
      relations: {
        patient: true,
      },
    });
  }

  getPatientByDoctorAndPatientId(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatient | null> {
    return this.repository.findOne({
      where: {
        doctorId: doctorId,
        patientId: patientId,
      },
      relations: {
        patient: true,
      },
    });
  }

  getPatientsByDoctorAndPatientsIds(
    doctorId: UUID,
    patientsIds: UUID[],
  ): Promise<DoctorPatient[]> {
    return this.repository.find({
      where: {
        doctorId: doctorId,
        patientId: In(patientsIds),
      },
      relations: {
        patient: true,
      },
    });
  }

  createDoctorPatient(doctorPatient: DoctorPatient): Promise<DoctorPatient> {
    return this.repository.save(doctorPatient);
  }

  async deleteDoctorPatient(doctorPatient: DoctorPatient): Promise<void> {
    await this.repository.softDelete(doctorPatient.id);
  }

  async deleteAllPatientsOfDoctor(doctorId: UUID): Promise<void> {
    await this.repository.softDelete({ doctorId: doctorId });
  }

  async deleteAllRelationsOfPatient(patientId: UUID): Promise<void> {
    await this.repository.softDelete({ patientId: patientId });
  }

  async changeNeedsAttentionStatus(
    doctorPatient: DoctorPatient,
    needsAttention: boolean,
  ): Promise<DoctorPatient> {
    doctorPatient.needsAttention = needsAttention;
    return this.repository.save(doctorPatient);
  }

  async changeAssignedStatus(
    doctorPatient: DoctorPatient,
    isAssigned: boolean,
  ): Promise<DoctorPatient> {
    if (!isAssigned) {
      doctorPatient.unassignedAt = new Date();
    } else {
      doctorPatient.unassignedAt = null;
    }
    return this.repository.save(doctorPatient);
  }
}
