/* eslint-disable @typescript-eslint/unbound-method */
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../../../../core/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthGuard(reflector);
    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(),
    } as unknown as ExecutionContext;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('returns true when the route is public', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('returns the result from passport AuthGuard when route is not public and passport allows access (true)', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const canActivateSpy = jest
        .spyOn(AuthGuard('jwt').prototype, 'canActivate')
        .mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(canActivateSpy).toHaveBeenCalledWith(context);
    });

    it('returns the result from passport AuthGuard when route is not public and passport denies access (false)', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      const canActivateSpy = jest
        .spyOn(AuthGuard('jwt').prototype, 'canActivate')
        .mockReturnValue(false);

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
      expect(canActivateSpy).toHaveBeenCalledWith(context);
    });
  });
});
