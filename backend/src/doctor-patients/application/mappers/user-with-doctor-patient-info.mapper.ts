import { UserDto } from '../../../users/presentation/dtos/user.dto';
import { DoctorPatientDto } from '../../presentation/dtos/doctor-patient.dto';
import { UserWithDoctorPatientInfoDto } from '../../presentation/dtos/user-with-doctor-patient-info.dto';

export class UserWithDoctorPatientInfoMapper {
  static combineUserAndDoctorPatient(
    userDto: UserDto,
    doctorPatient: DoctorPatientDto | null | undefined,
  ): UserWithDoctorPatientInfoDto {
    return {
      ...userDto,
      doctorPatientInfo: doctorPatient
        ? {
            id: doctorPatient.id,
            needsAttention: doctorPatient.needsAttention,
            assignedAt: doctorPatient.assignedAt,
          }
        : null,
    };
  }
}
