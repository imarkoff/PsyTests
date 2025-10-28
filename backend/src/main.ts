import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './auth/infrastructure/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');
  if (!port) {
    throw new Error('Server port is not specified');
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());

  const jwtGuard = app.get(JwtAuthGuard);
  const rolesGuard = app.get(RolesGuard);
  app.useGlobalGuards(jwtGuard, rolesGuard);

  await app.listen(port);
}

void bootstrap();
