import { UserRole } from 'generated/prisma';
import { RoleValidator } from './role-validator.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleValidatorImpl implements RoleValidator {
  isAdmin(role: UserRole): boolean {
    return role === UserRole.ADMIN;
  }
  isDoctor(role: UserRole): boolean {
    return role === UserRole.DOCTOR;
  }
  isPatient(role: UserRole): boolean {
    return role === UserRole.PATIENT;
  }
  isDoctorOrAdmin(role: UserRole): boolean {
    return role === UserRole.DOCTOR || role === UserRole.ADMIN;
  }
}
