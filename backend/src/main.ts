import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { JwtAuthGuard } from './auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './auth/infrastructure/guards/roles.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ControllerLoggerInterceptor } from './core/interceptors/controller-logger.interceptor';
import { AppConfigGetter } from './core/config/configs/app';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigGetter).get();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: appConfig.apiVersion,
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
    .addTag('Psychological Tests', 'Endpoints for managing psychological tests')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, documentFactory);

  const controllerLoggerInterceptor = app.get(ControllerLoggerInterceptor);
  app.useGlobalInterceptors(controllerLoggerInterceptor);

  const jwtGuard = app.get(JwtAuthGuard);
  const rolesGuard = app.get(RolesGuard);
  app.useGlobalGuards(jwtGuard, rolesGuard);

  await app.listen(appConfig.port);
}

void bootstrap();
