import { UUID } from 'crypto';
import {
  DoctorPatient,
  PrismaDoctorPatient,
} from '../../domain/entities/doctor-patient.entity';
import { DoctorPatientsRepository } from '../../domain/interfaces/doctor-patients.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { PaginationParams } from '../../../shared/pagination/types/pagination-params.type';
import { PrismaPaginator } from '../../../shared/pagination/prisma-applier/prisma-paginator.service';
import { DbPaginated } from '../../../shared/pagination/types/db-paginated.type';

@Injectable()
export class PrismaDoctorPatientsRepository
  implements DoctorPatientsRepository
{
  private readonly logger = new Logger(PrismaDoctorPatientsRepository.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaPaginator: PrismaPaginator,
  ) {}

  async getPatientsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<DoctorPatient>,
  ): Promise<DbPaginated<DoctorPatient>> {
    this.logger.debug(`Fetching patients for doctor with ID: ${doctorId}.`);

    const paginatedPatients = await this.prismaPaginator.applyPagination<
      'DoctorPatient',
      PrismaDoctorPatient
    >(
      (args) => this.prismaService.doctorPatient.findMany(args),
      (args) => this.prismaService.doctorPatient.count(args),
      paginationParams as PaginationParams<PrismaDoctorPatient>,
      ['patientId', 'assignedAt', 'needsAttention'],
      {
        doctorId: doctorId,
        deletedAt: null,
      },
      {
        patient: true,
      },
    );

    this.logger.debug(
      `Fetched ${paginatedPatients.items.length} patients for doctor with ID: ${doctorId}.`,
    );

    return paginatedPatients as DbPaginated<DoctorPatient>;
  }

  async getPatientByDoctorAndPatientId(
    doctorId: UUID,
    patientId: UUID,
  ): Promise<DoctorPatient | null> {
    this.logger.debug(
      `Fetching patient with ID: ${patientId} for doctor with ID: ${doctorId}.`,
    );

    const prismaPatient = await this.prismaService.doctorPatient.findFirst({
      where: {
        doctorId: doctorId,
        patientId: patientId,
        deletedAt: null,
      },
      orderBy: {
        assignedAt: 'desc',
      },
    });

    if (!prismaPatient) {
      this.logger.debug(
        `No patient found with ID: ${patientId} for doctor with ID: ${doctorId}.`,
      );
      return null;
    }

    this.logger.debug(
      `Fetched patient with ID: ${patientId} for doctor with ID: ${doctorId}.`,
    );

    return DoctorPatient.fromPersistence(prismaPatient);
  }

  async getPatientsByDoctorAndPatientsIds(
    doctorId: UUID,
    patientsIds: UUID[],
  ): Promise<DoctorPatient[]> {
    const jointIds = patientsIds.join(', ');
    this.logger.debug(
      `Fetching patients with IDs: [${jointIds}] for doctor with ID: ${doctorId}.`,
    );

    const prismaPatients = await this.prismaService.doctorPatient.findMany({
      where: {
        doctorId: doctorId,
        patientId: { in: patientsIds },
        deletedAt: null,
      },
    });

    this.logger.debug(
      `Fetched ${prismaPatients.length} patients for doctor with ID: ${doctorId}.`,
    );

    return prismaPatients.map((prismaPatient) =>
      DoctorPatient.fromPersistence(prismaPatient),
    );
  }

  async createDoctorPatient(
    doctorPatient: DoctorPatient,
  ): Promise<DoctorPatient> {
    this.logger.debug(
      `Creating doctor-patient relation: Doctor ID ${doctorPatient.doctorId}, Patient ID ${doctorPatient.patientId}.`,
    );

    const created = await this.prismaService.doctorPatient.create({
      data: doctorPatient.toPersistence(),
      include: {
        patient: true,
      },
    });

    this.logger.debug(
      `Created doctor-patient relation with ID: ${created.id}.`,
    );

    return DoctorPatient.fromPersistence(created);
  }

  async deleteDoctorPatient(doctorPatient: DoctorPatient): Promise<void> {
    this.logger.debug(
      `Deleting doctor-patient relation with ID: ${doctorPatient.id}.`,
    );

    await this.prismaService.doctorPatient.update({
      where: { id: doctorPatient.id },
      data: { deletedAt: new Date() },
    });

    this.logger.debug(
      `Soft deleted doctor-patient relation with ID: ${doctorPatient.id}.`,
    );
  }

  async deleteAllPatientsOfDoctor(doctorId: UUID): Promise<void> {
    this.logger.debug(`Deleting all patients for doctor with ID: ${doctorId}.`);

    await this.prismaService.doctorPatient.updateMany({
      where: { doctorId: doctorId, deletedAt: null },
      data: { deletedAt: new Date(), unassignedAt: new Date() },
    });

    this.logger.debug(
      `Soft deleted all patients for doctor with ID: ${doctorId}.`,
    );
  }

  async deleteAllRelationsOfPatient(patientId: UUID): Promise<void> {
    this.logger.debug(
      `Deleting all relations for patient with ID: ${patientId}.`,
    );

    await this.prismaService.doctorPatient.updateMany({
      where: { patientId: patientId, deletedAt: null },
      data: { deletedAt: new Date(), unassignedAt: new Date() },
    });

    this.logger.debug(
      `Soft deleted all relations for patient with ID: ${patientId}.`,
    );
  }

  async changeNeedsAttentionStatus(
    doctorPatient: DoctorPatient,
    needsAttention: boolean,
  ): Promise<DoctorPatient> {
    this.logger.debug(
      `Changing needsAttention status for doctor-patient relation with ID: ${doctorPatient.id} to ${needsAttention}.`,
    );

    const updated = await this.prismaService.doctorPatient.update({
      where: { id: doctorPatient.id },
      data: { needsAttention: needsAttention },
    });

    this.logger.debug(
      `Changed needsAttention status for doctor-patient relation with ID: ${doctorPatient.id} to ${needsAttention}.`,
    );

    return DoctorPatient.fromPersistence(updated);
  }

  async changeAssignedStatus(
    doctorPatient: DoctorPatient,
    isAssigned: boolean,
  ): Promise<DoctorPatient> {
    this.logger.debug(
      `Changing assigned status for doctor-patient relation with ID: ${doctorPatient.id} to ${isAssigned}.`,
    );

    const updated = await this.prismaService.doctorPatient.update({
      where: { id: doctorPatient.id },
      data: {
        unassignedAt: isAssigned ? null : new Date(),
      },
    });

    this.logger.debug(
      `Changed assigned status for doctor-patient relation with ID: ${doctorPatient.id} to ${isAssigned}.`,
    );

    return DoctorPatient.fromPersistence(updated);
  }
}
