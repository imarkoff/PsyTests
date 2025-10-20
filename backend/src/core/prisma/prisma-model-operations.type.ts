import { Prisma } from 'generated/prisma';

export type PrismaModelOperationsMap = {
  User: {
    findMany: Prisma.UserFindManyArgs;
    count: Prisma.UserCountArgs;
    whereClause: Prisma.UserWhereInput;
  };
  DoctorPatient: {
    findMany: Prisma.DoctorPatientFindManyArgs;
    count: Prisma.DoctorPatientCountArgs;
    whereClause: Prisma.DoctorPatientWhereInput;
  };
  TestResult: {
    findMany: Prisma.TestResultFindManyArgs;
    count: Prisma.TestResultCountArgs;
    whereClause: Prisma.TestResultWhereInput;
  };
  AssignedTest: {
    findMany: Prisma.AssignedTestFindManyArgs;
    count: Prisma.AssignedTestCountArgs;
    whereClause: Prisma.AssignedTestWhereInput;
  };
};

export type PrismaModelKey = keyof PrismaModelOperationsMap;

export type PrismaModelOperations<T extends PrismaModelKey> =
  PrismaModelOperationsMap[T];
