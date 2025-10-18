import { Global, Module } from '@nestjs/common';
import { UUIDValidator } from './uuid-validator/uuid-validator.interface';
import { UuidValidatorImpl } from './uuid-validator/uuid-validator.service';

@Global()
@Module({
  providers: [
    {
      provide: UUIDValidator,
      useClass: UuidValidatorImpl,
    },
  ],
  exports: [UUIDValidator],
})
export class ValidationsModule {}
