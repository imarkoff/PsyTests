import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
