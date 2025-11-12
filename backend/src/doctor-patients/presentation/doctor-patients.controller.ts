import {
  Body,
  Controller,
  Delete,
  Get,
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
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
@Controller('doctor-patients')
@Roles([UserRole.DOCTOR])
@ApiBearerAuth()
export class DoctorPatientsController {
  constructor(
    private readonly doctorPatientOrchestrator: DoctorPatientOrchestrator,
  ) {}

  @ApiOperation({
    summary: 'Get active patients assigned to the authenticated doctor',
  })
  @ApiOkResponse({ type: PaginatedDoctorPatientDto })
  @ApiBadRequestResponse({
    description: 'Invalid pagination, sorting, or filtering parameters',
  })
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

  @ApiOperation({
    summary: 'Find all patients in the system.',
    description:
      'Allows the doctor to search for patients to assign to their care. ' +
      'Also shows additional info if the patient is already assigned to the doctor.',
  })
  @Get('find')
  @ApiOkResponse({ type: PaginatedUserWithDoctorPatientInfoDto })
  @ApiBadRequestResponse({
    description: 'Invalid pagination, sorting, or filtering parameters',
  })
  findPatients(
    @Query() paginationParams: QueryPaginationParamsDto,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.findPatients(
      user.id,
      PaginationParamsMapper.toPaginationParams(paginationParams),
    );
  }

  @ApiOperation({
    summary:
      'Get the assignment details between the authenticated doctor and a specific patient',
  })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: DoctorPatientDto })
  @ApiNotFoundResponse({ description: 'Patient not assigned to the doctor' })
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

  @ApiOperation({
    summary: 'Create a new patient and assign them to the authenticated doctor',
  })
  @ApiOkResponse({ type: DoctorPatientDto })
  @ApiBadRequestResponse({ description: 'Invalid patient creation data' })
  @ApiConflictResponse({
    description: 'Patient with given phone already exists',
  })
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

  @ApiOperation({
    summary:
      'Assign an existing patient to the authenticated doctor by patient ID',
  })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ type: DoctorPatientDto })
  @ApiConflictResponse({
    description: 'Patient is already assigned to the authenticated doctor',
  })
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

  @ApiOperation({
    summary:
      'Mark the doctor-patient assignment as read for the authenticated doctor',
  })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({ description: 'Doctor-patient assignment marked as read' })
  @ApiNotFoundResponse({ description: 'Patient not assigned to the doctor' })
  @Patch(':patientId/mark-as-read')
  markPatientAsRead(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientOrchestrator.markDoctorPatientAsRead(
      user.id,
      patientId,
    );
  }

  @ApiOperation({
    summary: 'Unassign a patient from the authenticated doctor by patient ID',
  })
  @ApiParam({ name: 'patientId', format: 'uuid' })
  @ApiOkResponse({
    description: 'Patient unassigned from the doctor successfully',
  })
  @ApiNotFoundResponse({ description: 'Patient not assigned to the doctor' })
  @Delete(':patientId')
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
