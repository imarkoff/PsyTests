import { ConflictException } from '@nestjs/common';

export class DoctorPatientAlreadyExistsException extends ConflictException {
  constructor(doctorId: string, patientId: string) {
    super(
      `The association between doctor with ID ${doctorId} and patient with ID ${patientId} already exists.`,
    );
  }
}
