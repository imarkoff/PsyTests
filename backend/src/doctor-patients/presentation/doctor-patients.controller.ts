import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PatientCreateDto } from './dtos/patient-create.dto';
import { DoctorPatientOrchestrator } from '../application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.abstract';
import { QueryPaginationParamsDto } from '../../shared/pagination/dtos/query-pagination-params.dto';
import { PaginationParamsMapper } from '../../shared/pagination/mappers/pagination-params.mapper';
import { createPaginatedListDto } from '../../shared/pagination/dtos/paginated-list.dto';
import { UserWithDoctorPatientInfoDto } from './dtos/user-with-doctor-patient-info.dto';
import { DoctorPatientDto } from './dtos/doctor-patient.dto';

const PaginatedDoctorPatientDto = createPaginatedListDto(DoctorPatientDto);
const PaginatedUserWithDoctorPatientInfoDto = createPaginatedListDto(
  UserWithDoctorPatientInfoDto,
);

@ApiTags('Doctor Patients')
@Controller('doctor/patients')
@Roles([UserRole.DOCTOR])
@ApiBearerAuth()
export class DoctorPatientsController {
  constructor(
    private readonly doctorPatientOrchestrator: DoctorPatientOrchestrator,
  ) {}

  /**
   * Get active patients assigned to the authenticated doctor
   * @throws {400} If pagination, sorting, or filtering parameters are invalid
   */
  @ApiOkResponse({ type: PaginatedDoctorPatientDto })
  @Get()
  getPatientsByDoctor(
    @Query() paginationParams: QueryPaginationParamsDto,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.getActivePatientsByDoctor(
      user.id,
      PaginationParamsMapper.toPaginationParams(paginationParams),
    );
  }

  /**
   * Find patients in the system to assign to the authenticated doctor
   *
   * @remarks
   *  Allows searching for patients to assign to the doctor's care.
   *  Also provides additional information if the patient is already assigned to the doctor.
   *
   * @throws {400} If pagination, sorting, or filtering parameters are invalid
   */
  @Get('find')
  @ApiOkResponse({ type: PaginatedUserWithDoctorPatientInfoDto })
  findPatients(
    @Query() paginationParams: QueryPaginationParamsDto,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.findPatients(
      user.id,
      PaginationParamsMapper.toPaginationParams(paginationParams),
    );
  }

  /**
   * Get the assignment details between the authenticated doctor and a specific patient
   * @throws {404} If the patient is not assigned to the doctor
   */
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: DoctorPatientDto })
  @Get(':patientId')
  assignPatient(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.getDoctorPatientByDoctorAndPatientIds(
      user.id,
      patientId,
    );
  }

  /**
   * Create a new patient and assign them to the authenticated doctor
   * @throws {400} If patient creation data is invalid
   * @throws {409} If a patient with the given phone already exists
   */
  @ApiCreatedResponse({ type: DoctorPatientDto })
  @Post()
  createDoctorPatient(
    @Body() patientCreate: PatientCreateDto,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.createNewPatientAndAssignToDoctor(
      user.id,
      patientCreate,
    );
  }

  /**
   * Assign an existing patient to the authenticated doctor by patient ID
   * @throws {404} If the patient does not exist
   * @throws {409} If the patient is already assigned to the doctor
   */
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiCreatedResponse({ type: DoctorPatientDto })
  @Post(':patientId')
  assignExistingPatient(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.assignExistingPatientToDoctor(
      user.id,
      patientId,
    );
  }

  /**
   * Mark the doctor-patient assignment as read for the authenticated doctor
   * @throws {204} If the assignment is marked as read successfully
   * @throws {404} If the patient is not assigned to the doctor
   */
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @Patch(':patientId/mark-as-read')
  @HttpCode(204)
  markPatientAsRead(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.markDoctorPatientAsRead(
      user.id,
      patientId,
    );
  }

  /**
   * Unassign a patient from the authenticated doctor by patient ID
   * @throws {204} If the patient is unassigned successfully
   * @throws {404} If the patient is not assigned to the doctor
   */
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @Delete(':patientId')
  @HttpCode(204)
  unassignPatient(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.unassignPatientFromDoctor(
      user.id,
      patientId,
    );
  }
}
