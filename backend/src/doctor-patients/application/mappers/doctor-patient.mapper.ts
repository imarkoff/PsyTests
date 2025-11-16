import { DoctorPatient } from '../../domain/entities/doctor-patient.entity';
import { DoctorPatientDto } from '../../presentation/dtos/doctor-patient.dto';
import { UserMapper } from '../../../users/application/mappers/user.mapper';
import { randomUUID, UUID } from 'node:crypto';

export class DoctorPatientMapper {
  static toDto(entity: DoctorPatient): DoctorPatientDto {
    const dto = new DoctorPatientDto();
    dto.id = entity.id;
    dto.doctorId = entity.doctorId;
    dto.doctor = entity.doctor ? UserMapper.toDto(entity.doctor) : null;
    dto.patientId = entity.patientId;
    dto.patient = entity.patient ? UserMapper.toDto(entity.patient) : null;
    dto.assignedAt = entity.assignedAt;
    dto.unassignedAt = entity.unassignedAt;
    dto.needsAttention = entity.needsAttention;
    dto.deletedAt = entity.deletedAt;
    return dto;
  }

  static createNewRelation(doctorId: UUID, patientId: UUID): DoctorPatient {
    const entity = new DoctorPatient();
    entity.id = randomUUID();
    entity.doctorId = doctorId;
    entity.patientId = patientId;
    entity.assignedAt = new Date();
    entity.unassignedAt = null;
    entity.needsAttention = false;
    return entity;
  }
}
