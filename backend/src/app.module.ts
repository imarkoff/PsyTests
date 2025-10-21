import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig, dbConfig, fileStorageConfig } from './core/config';
import { UserModule } from './users/user.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { PaginationModule } from './shared/pagination/pagination.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [appConfig, dbConfig, fileStorageConfig],
    }),
    UserModule,
    PrismaModule,
    PaginationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
