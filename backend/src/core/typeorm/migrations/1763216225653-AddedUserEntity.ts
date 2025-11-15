import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedUserEntity1763216225653 implements MigrationInterface {
  name = 'AddedUserEntity1763216225653';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('MALE', 'FEMALE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'DOCTOR', 'PATIENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "patronymic" character varying(255), "gender" "public"."user_gender_enum" NOT NULL, "birthDate" date NOT NULL, "phone" character varying NOT NULL, "password" bytea NOT NULL, "passwordSalt" bytea NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'PATIENT', "registeredAt" TIMESTAMP NOT NULL, "lastLoginAt" TIMESTAMP, "deletedAt" TIMESTAMP, "registeredById" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_4a463f7775adc78d6c2b9a1d1b3" FOREIGN KEY ("registeredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_4a463f7775adc78d6c2b9a1d1b3"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
  }
}
