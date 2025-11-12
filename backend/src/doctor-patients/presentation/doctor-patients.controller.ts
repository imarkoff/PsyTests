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
import { ApiBearerAuth } from '@nestjs/swagger';
import { PatientCreateDto } from './dtos/patient-create.dto';
import { DoctorPatientOrchestrator } from '../application/services/doctor-patient-orchestrator/doctor-patient-orchestrator.abstract';
import { FilterOperator } from '../../shared/pagination/enums/filter-operator.enum';

@Controller('doctor-patients')
@Roles([UserRole.DOCTOR, UserRole.ADMIN])
@ApiBearerAuth()
export class DoctorPatientsController {
  constructor(
    private readonly doctorPatientOrchestrator: DoctorPatientOrchestrator,
  ) {}

  @Get()
  getPatientsByDoctor(@UserFromAuth() user: User) {
    return this.doctorPatientOrchestrator.getActivePatientsByDoctor(user.id, {
      sortedFields: [],
      page: 1,
      pageSize: 10,
    });
  }

  @Get('find')
  findPatients(@Query('search') search: string, @UserFromAuth() user: User) {
    return this.doctorPatientOrchestrator.findPatients(user.id, {
      quickFilter: {
        filters: search.split(' '),
        operator: FilterOperator.OR,
      },
      sortedFields: [],
      page: 1,
      pageSize: 10,
    });
  }

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
