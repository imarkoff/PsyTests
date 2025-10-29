import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './auth/infrastructure/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());

  const apiVersion = configService.get<string>('apiVersion')!;
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PsyTests API')
    .setDescription('API documentation for PsyTests application')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag(
      'Authentication',
      'Endpoints related to user authentication and authorization',
    )
    .addTag('Users', 'Endpoints for managing user accounts and profiles')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const jwtGuard = app.get(JwtAuthGuard);
  const rolesGuard = app.get(RolesGuard);
  app.useGlobalGuards(jwtGuard, rolesGuard);

  const port = configService.get<string>('PORT')!;
  await app.listen(port);
}

void bootstrap();
