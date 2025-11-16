import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedTestResultEntity1763321235821 implements MigrationInterface {
  name = 'AddedTestResultEntity1763321235821';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "test_result" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "testId" uuid NOT NULL, "completedAt" TIMESTAMP NOT NULL DEFAULT now(), "resultsData" jsonb NOT NULL, "verdictData" jsonb, "completedByPatientId" uuid, CONSTRAINT "PK_95770fb76248f4c3def5de11a72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "assigned_test" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "testId" uuid NOT NULL, "assignedToPatientId" uuid NOT NULL, "assignedByDoctorId" uuid NOT NULL, "assignedAt" TIMESTAMP NOT NULL, "unassignedAt" TIMESTAMP, CONSTRAINT "PK_880f85fc7b698524c65312d5791" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_fdaddf39db96906e183460b8824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_022378a74b4f8a631f985966643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ALTER COLUMN "doctorId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ALTER COLUMN "patientId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_fdaddf39db96906e183460b8824" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_022378a74b4f8a631f985966643" FOREIGN KEY ("patientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_result" ADD CONSTRAINT "FK_01fbc10ddd6573f5dc31b83ee42" FOREIGN KEY ("completedByPatientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_test" ADD CONSTRAINT "FK_bae19d24bb240c066ced4a653db" FOREIGN KEY ("assignedToPatientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_test" ADD CONSTRAINT "FK_95f3ce7f18376a84e669cda7e1d" FOREIGN KEY ("assignedByDoctorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "assigned_test" DROP CONSTRAINT "FK_95f3ce7f18376a84e669cda7e1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "assigned_test" DROP CONSTRAINT "FK_bae19d24bb240c066ced4a653db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "test_result" DROP CONSTRAINT "FK_01fbc10ddd6573f5dc31b83ee42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_022378a74b4f8a631f985966643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_fdaddf39db96906e183460b8824"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ALTER COLUMN "patientId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ALTER COLUMN "doctorId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_022378a74b4f8a631f985966643" FOREIGN KEY ("patientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_fdaddf39db96906e183460b8824" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "assigned_test"`);
    await queryRunner.query(`DROP TABLE "test_result"`);
  }
}
