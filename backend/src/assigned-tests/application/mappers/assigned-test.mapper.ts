import { AssignedTestDto } from '../../presentation/dtos/assigned-test.dto';
import { UserMapper } from '../../../users/application/mappers/user.mapper';
import { AssignedTest } from '../../domain/entities/assigned-test.entity';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';

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
}
