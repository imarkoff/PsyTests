import { UserRole } from '../../../shared/enums/user-role.enum';

/**
 * Service for validating user roles.
 */
export abstract class RoleValidator {
  abstract isAdmin(role: UserRole): boolean;
  abstract isDoctor(role: UserRole): boolean;
  abstract isPatient(role: UserRole): boolean;
  abstract isDoctorOrAdmin(role: UserRole): boolean;
}
