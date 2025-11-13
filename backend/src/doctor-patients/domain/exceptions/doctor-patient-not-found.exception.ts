import { NotFoundException } from '@nestjs/common';

export class DoctorPatientNotFoundException extends NotFoundException {
  constructor(doctorId: string, patientId: string) {
    super(
      'Doctor-Patient relationship not found ' +
        `for Doctor ID: ${doctorId} and Patient ID: ${patientId}`,
    );
  }
}
