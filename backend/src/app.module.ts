import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  dbConfig,
  fileStorageConfig,
  jwtConfig,
  passwordConfig,
} from './core/config';
import { UserModule } from './users/user.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { PaginationModule } from './shared/pagination/pagination.module';
import { ValidationsModule } from './core/validations/validations.module';
import { AuthModule } from './auth/auth.module';
import { DecoratorsModule } from './core/decorators/decorators.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';
import { ControllerLoggerInterceptor } from './core/interceptors/controller-logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, dbConfig, fileStorageConfig, jwtConfig, passwordConfig],
    }),
    UserModule,
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
