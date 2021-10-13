import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedToWarehouseToTransactionFieldsForTransfer1634127707658 implements MigrationInterface {
    name = 'AddedToWarehouseToTransactionFieldsForTransfer1634127707658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD \`toWarehouseId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD CONSTRAINT \`FK_cceb911f20381e062876a974dc5\` FOREIGN KEY (\`toWarehouseId\`) REFERENCES \`pinnzzxc_estock\`.\`warehouses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP FOREIGN KEY \`FK_cceb911f20381e062876a974dc5\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP COLUMN \`toWarehouseId\``);
    }

}
