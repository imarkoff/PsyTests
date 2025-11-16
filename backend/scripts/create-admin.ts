import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { FirstAdminCreator } from '../src/users/application/services/first-admin-creator/first-admin-creator.abstract';
import { UserCreateDto } from '../src/users/presentation/dtos/user-create.dto';
import { INestApplicationContext } from '@nestjs/common';
import { UserRole } from '../src/shared/enums/user-role.enum';
import { UserGender } from '../src/shared/enums/user-gender.enum';
import { parseProcessEnv } from '../src/core/config/utils/parse-process-env.util';

async function bootstrap() {
  let app: INestApplicationContext | null = null;
  try {
    app = await NestFactory.createApplicationContext(AppModule);
    const firstAdminCreator = app.get(FirstAdminCreator);

    const adminDto: UserCreateDto = {
      name: parseProcessEnv('ADMIN_NAME'),
      surname: parseProcessEnv('ADMIN_SURNAME'),
      patronymic: parseProcessEnv('ADMIN_PATRONYMIC', null),
      role: UserRole.ADMIN,
      password: parseProcessEnv('ADMIN_PASSWORD'),
      birthDate: new Date(parseProcessEnv('ADMIN_BIRTHDATE')),
      phone: parseProcessEnv('ADMIN_PHONE'),
      gender: parseProcessEnv('ADMIN_GENDER') as UserGender,
    };

    console.log(`Creating admin user with phone: ${adminDto.phone}...`);
    const admin = await firstAdminCreator.createFirstAdminIfNotExists(adminDto);
    console.log('Admin user created successfully:', admin.phone);
  } catch (error) {
    console.error('Error creating admin user:', (error as Error).message);
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
    process.exit(0);
  }
}

void bootstrap();
