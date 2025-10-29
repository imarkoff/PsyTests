/* eslint-disable @typescript-eslint/unbound-method */
import { RolesGuard } from '../../../infrastructure/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { Roles } from '../../../../core/decorators/roles.decorator';
import { User } from '../../../../users/domain/entities/user.entity';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import type { Request } from 'express';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let context: ExecutionContext;
  let mockRequest: Request;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    mockRequest = {
      user: undefined,
    } as unknown as Request;

    context = {
      getHandler: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('returns true when no roles are required for the route', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('returns true when an empty roles array is provided', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([]);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('returns true when user has the required role', () => {
      const requiredRoles = [UserRole.ADMIN];
      mockRequest.user = { role: UserRole.ADMIN } as User;
      jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

      expect(guard.canActivate(context)).toBe(true);
      expect(reflector.get).toHaveBeenCalledWith(Roles, context.getHandler());
    });

    it('returns false when user does not have the required role', () => {
      const requiredRoles = [UserRole.ADMIN];
      mockRequest.user = { role: UserRole.PATIENT } as User;
      jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

      expect(guard.canActivate(context)).toBe(false);
    });

    it('returns true when user has one of the multiple required roles', () => {
      const requiredRoles = [UserRole.ADMIN, UserRole.PATIENT];
      mockRequest.user = { role: UserRole.PATIENT } as User;
      jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

      expect(guard.canActivate(context)).toBe(true);
    });

    it('throws an error if user is not on the request', () => {
      const requiredRoles = [UserRole.ADMIN];
      mockRequest.user = undefined;
      jest.spyOn(reflector, 'get').mockReturnValue(requiredRoles);

      expect(() => guard.canActivate(context)).toThrow();
    });
  });
});
