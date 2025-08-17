import { MigrationInterface, QueryRunner } from "typeorm";

export class DatasetItem1755429902094 implements MigrationInterface {
    name = 'DatasetItem1755429902094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dataset_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matrix" bytea NOT NULL, "value" smallint NOT NULL, CONSTRAINT "PK_3b6253921926253dd6610fa15cc" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dataset_item"`);
    }

}
