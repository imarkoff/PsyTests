import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { PaginationModule } from './shared/pagination/pagination.module';
import { ValidationsModule } from './core/validations/validations.module';
import { AuthModule } from './auth/auth.module';
import { DecoratorsModule } from './core/decorators/decorators.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { ControllerLoggerInterceptor } from './core/interceptors/controller-logger.interceptor';
import { PsyTestsModule } from './psy-tests/psy-tests.module';
import { CoreConfigModule } from './core/config/core-config.module';

@Module({
  imports: [
    CoreConfigModule,
    UserModule,
    PsyTestsModule,
    PrismaModule,
    PaginationModule,
    DecoratorsModule,
    ValidationsModule,
    AuthModule,
  ],
  providers: [ControllerLoggerInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
