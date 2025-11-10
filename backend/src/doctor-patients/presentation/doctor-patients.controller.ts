import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import type { UUID } from 'node:crypto';
import { QueryBus } from '@nestjs/cqrs';
import { AssignDoctorPatientCommand } from '../application/commands/assign-doctor-patient/assign-doctor-patient.command';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UserFromAuth } from '../../core/decorators/user-from-auth.decorator';
import { User } from '../../users/domain/entities/user.entity';
import { GetPatientsByDoctorIdQuery } from '../application/queries/get-patients-by-doctor-id/get-patients-by-doctor-id.query';
import { ApiBearerAuth } from '@nestjs/swagger';
import { DoctorPatientCreator } from '../application/services/doctor-patient-creator/doctor-patient-creator.abstract';
import { PatientCreateDto } from './dtos/patient-create.dto';

@Controller('doctor-patients')
@Roles([UserRole.DOCTOR, UserRole.ADMIN])
@ApiBearerAuth()
export class DoctorPatientsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly doctorPatientCreator: DoctorPatientCreator,
  ) {}

  @Post()
  createDoctorPatient(
    @Body() patientCreate: PatientCreateDto,
    @UserFromAuth() user: User,
  ) {
    return this.doctorPatientCreator.createDoctorPatient(
      user.id,
      patientCreate,
    );
  }

  @Post(':patientId')
  assignPatient(
    @Param('patientId', new ParseUUIDPipe()) patientId: UUID,
    @UserFromAuth() user: User,
  ) {
    return this.queryBus.execute(
      new AssignDoctorPatientCommand(user.id, patientId),
    );
  }

  @Get()
  getPatientsByDoctor(@UserFromAuth() user: User) {
    return this.queryBus.execute(
      new GetPatientsByDoctorIdQuery(user.id, {
        sortedFields: [],
        page: 1,
        pageSize: 10,
      }),
    );
  }
}
