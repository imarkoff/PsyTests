import { Module } from '@nestjs/common';
import { AssignedTestsRepository } from './domain/interfaces/assigned-tests.repository';
import { PrismaAssignedTestsRepository } from './domain/infrastructure/prisma/prisma-assigned-tests.repository';

@Module({
  controllers: [],
  providers: [
    {
      provide: AssignedTestsRepository,
      useValue: PrismaAssignedTestsRepository,
    },
  ],
})
export class AssignedTestsModule {}
