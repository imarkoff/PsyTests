import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDoctorPatientEntity1763309956082
  implements MigrationInterface
{
  name = 'AddedDoctorPatientEntity1763309956082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "doctor_patient" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "assignedAt" TIMESTAMP NOT NULL, "unassignedAt" TIMESTAMP, "needsAttention" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "doctorId" uuid, "patientId" uuid, CONSTRAINT "PK_eab52a93c854c8d7c7ae8cfa279" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_fdaddf39db96906e183460b8824" FOREIGN KEY ("doctorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" ADD CONSTRAINT "FK_022378a74b4f8a631f985966643" FOREIGN KEY ("patientId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_022378a74b4f8a631f985966643"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctor_patient" DROP CONSTRAINT "FK_fdaddf39db96906e183460b8824"`,
    );
    await queryRunner.query(`DROP TABLE "doctor_patient"`);
  }
}
