import { UUID } from 'crypto';
import { PaginationParams } from 'src/shared/pagination/domain/types/pagination-params.type';
import {
  AssignedTest,
  PrismaAssignedTest,
} from '../../entities/assigned-test.entity';
import { AssignedTestsRepository } from '../../interfaces/assigned-tests.repository';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';
import { PrismaPaginator } from '../../../../shared/pagination/application/prisma-applier/prisma-paginator.service';
import { DbPaginated } from '../../../../shared/pagination/domain/types/db-paginated.type';

@Injectable()
export class PrismaAssignedTestsRepository implements AssignedTestsRepository {
  private readonly logger = new Logger(PrismaAssignedTestsRepository.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly prismaPaginator: PrismaPaginator,
  ) {}

  async getById(assignedTestId: UUID): Promise<AssignedTest | null> {
    this.logger.debug(`Fetching assigned test by ID: ${assignedTestId}`);

    const prismaAssignedTest = await this.prismaService.assignedTest.findFirst({
      where: { id: assignedTestId },
    });

    if (!prismaAssignedTest) {
      this.logger.debug(`Assigned test with ID ${assignedTestId} not found.`);
      return null;
    }

    this.logger.debug(`Assigned test with ID ${assignedTestId} found.`);

    return AssignedTest.fromPersistence(prismaAssignedTest);
  }

  async getAssignedTestByTestIdAndPatientId(
    testId: UUID,
    patientId: UUID,
  ): Promise<AssignedTest | null> {
    this.logger.debug(
      `Getting assigned test for test ID: ${testId} and patient ID: ${patientId}`,
    );

    const prismaAssignedTest = await this.prismaService.assignedTest.findFirst({
      where: {
        testId: testId,
        assignedToPatientId: patientId,
        unassignedAt: null,
      },
    });

    if (!prismaAssignedTest) {
      this.logger.debug(
        `No assigned test found for test ID: ${testId} and patient ID: ${patientId}`,
      );
      return null;
    }

    this.logger.debug(
      `Assigned test found for test ID: ${testId} and patient ID: ${patientId}`,
    );

    return AssignedTest.fromPersistence(prismaAssignedTest);
  }

  async getAssignedTestsByPatientId(patientId: UUID): Promise<AssignedTest[]> {
    this.logger.debug(`Getting assigned tests by patient ID: ${patientId}`);

    const prismaAssignedTests = await this.prismaService.assignedTest.findMany({
      where: { assignedToPatientId: patientId, unassignedAt: null },
    });

    this.logger.debug(
      `Found ${prismaAssignedTests.length} assigned tests for patient ID: ${patientId}`,
    );

    return prismaAssignedTests.map((at) => AssignedTest.fromPersistence(at));
  }

  async getAssignedTestsByDoctorId(
    doctorId: UUID,
    paginationParams: PaginationParams<AssignedTest>,
  ): Promise<DbPaginated<AssignedTest>> {
    this.logger.debug(`Getting assigned tests by doctor ID: ${doctorId}`);

    const paginatedResult = await this.prismaPaginator.applyPagination<
      'AssignedTest',
      PrismaAssignedTest
    >(
      (params) => this.prismaService.assignedTest.findMany(params),
      (params) => this.prismaService.assignedTest.count(params),
      paginationParams as PaginationParams<PrismaAssignedTest>,
      [],
      {
        assignedByDoctorId: doctorId,
      },
    );

    this.logger.debug(
      `Found ${paginatedResult.items.length} assigned tests for doctor ID: ${doctorId}`,
    );

    return {
      ...paginatedResult,
      items: paginatedResult.items.map((at) =>
        AssignedTest.fromPersistence(at),
      ),
    };
  }

  async createTest(assignedTest: AssignedTest): Promise<AssignedTest> {
    this.logger.debug(
      `Creating assigned test for test ID: ${assignedTest.testId} and patient ID: ${assignedTest.assignedToPatientId}`,
    );

    const prismaAssignedTest = await this.prismaService.assignedTest.create({
      data: assignedTest.toPersistence(),
    });

    this.logger.debug(
      `Assigned test created with ID: ${prismaAssignedTest.id}`,
    );

    return AssignedTest.fromPersistence(prismaAssignedTest);
  }

  async unassignTest(assignedTest: AssignedTest): Promise<AssignedTest> {
    this.logger.debug(`Unassigning test with ID: ${assignedTest.id}`);

    const prismaAssignedTest = await this.prismaService.assignedTest.update({
      where: { id: assignedTest.id },
      data: { unassignedAt: assignedTest.unassignedAt },
    });

    this.logger.debug(
      `Test with ID: ${assignedTest.id} unassigned successfully`,
    );

    return AssignedTest.fromPersistence(prismaAssignedTest);
  }

  async unassignTestsByPatientIdAndDoctorId(
    patientId: UUID,
    doctorId: UUID,
  ): Promise<void> {
    this.logger.debug(
      `Unassigning tests for patient ID: ${patientId} and doctor ID: ${doctorId}`,
    );

    await this.prismaService.assignedTest.updateMany({
      where: {
        assignedToPatientId: patientId,
        assignedByDoctorId: doctorId,
        unassignedAt: null,
      },
      data: { unassignedAt: new Date() },
    });

    this.logger.debug(
      `Tests for patient ID: ${patientId} and doctor ID: ${doctorId} unassigned successfully`,
    );
  }

  async unassignTestsByPatientId(patientId: UUID): Promise<void> {
    this.logger.debug(`Unassigning tests for patient ID: ${patientId}`);

    await this.prismaService.assignedTest.updateMany({
      where: {
        assignedToPatientId: patientId,
        unassignedAt: null,
      },
      data: { unassignedAt: new Date() },
    });

    this.logger.debug(
      `Tests for patient ID: ${patientId} unassigned successfully`,
    );
  }

  async unassignTestsByDoctorId(doctorId: UUID): Promise<void> {
    this.logger.debug(`Unassigning tests for doctor ID: ${doctorId}`);

    await this.prismaService.assignedTest.updateMany({
      where: {
        assignedByDoctorId: doctorId,
        unassignedAt: null,
      },
      data: { unassignedAt: new Date() },
    });

    this.logger.debug(
      `Tests for doctor ID: ${doctorId} unassigned successfully`,
    );
  }
}
