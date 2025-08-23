import { MigrationInterface, QueryRunner } from "typeorm";

export class DatasetItem1755961308417 implements MigrationInterface {
    name = 'DatasetItem1755961308417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dataset_item_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "matrix" bytea NOT NULL, "value" smallint NOT NULL, CONSTRAINT "PK_63dca58db381bbb712442493385" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "dataset_item_entity"`);
    }

}
