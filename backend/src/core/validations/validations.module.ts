import { Global, Module } from '@nestjs/common';
import { UUIDValidator } from './uuid-validator/uuid-validator.interface';
import { UuidValidatorImpl } from './uuid-validator/uuid-validator.service';
import { RoleValidator } from './role-validator/role-validator.interface';
import { RoleValidatorImpl } from './role-validator/role-validator.service';

@Global()
@Module({
  providers: [
    {
      provide: UUIDValidator,
      useClass: UuidValidatorImpl,
    },
    {
      provide: RoleValidator,
      useClass: RoleValidatorImpl,
    },
  ],
  exports: [UUIDValidator, RoleValidator],
})
export class ValidationsModule {}
