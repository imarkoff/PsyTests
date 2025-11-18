import { AssignedTestDto } from '../../presentation/dtos/assigned-test.dto';
import { UserMapper } from '../../../users/application/mappers/user.mapper';
import { AssignedTest } from '../../domain/entities/assigned-test.entity';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';
import { User } from '../../../users/domain/entities/user.entity';
import { UUID } from 'node:crypto';

export class AssignedTestMapper {
  static toDto(entity: AssignedTest, test: PsyTestDto): AssignedTestDto {
    const dto = new AssignedTestDto();
    dto.id = entity.id;
    dto.test = test;
    dto.assignedToPatientId = entity.assignedToPatientId;
    dto.assignedToPatient = entity.assignedToPatient
      ? UserMapper.toDto(entity.assignedToPatient)
      : null;
    dto.assignedByDoctorId = entity.assignedByDoctorId;
    dto.assignedByDoctor = entity.assignedByDoctor
      ? UserMapper.toDto(entity.assignedByDoctor)
      : null;
    dto.assignedAt = entity.assignedAt;
    dto.unassignedAt = entity.unassignedAt;
    return dto;
  }

  static create(testId: UUID, doctor: User, patient: User): AssignedTest {
    const entity = new AssignedTest();
    entity.testId = testId;
    entity.assignedByDoctorId = doctor.id;
    entity.assignedByDoctor = doctor;
    entity.assignedToPatientId = patient.id;
    entity.assignedToPatient = patient;
    entity.assignedAt = new Date();
    return entity;
  }
}
