import {MigrationInterface, QueryRunner} from "typeorm";

export class AddOnDeleteCascadeToTransactionFields1634026493622 implements MigrationInterface {
    name = 'AddOnDeleteCascadeToTransactionFields1634026493622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`lines\` DROP FOREIGN KEY \`FK_6f26464a4192e5aa3c9e01ac887\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP FOREIGN KEY \`FK_8ddeb9b8dde609a7cdfda2e59c6\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP FOREIGN KEY \`FK_b59c6f74eb49c26ae8bdc73d2e8\``);
        await queryRunner.query(`DROP INDEX \`IDX_f3d5b8e8830f97a921a3bb2690\` ON \`pinnzzxc_estock\`.\`contacts\``);
        await queryRunner.query(`DROP INDEX \`IDX_65f3cf5ac9c203a8880206d33c\` ON \`pinnzzxc_estock\`.\`businessPartners\``);
        await queryRunner.query(`DROP INDEX \`IDX_c34b868d63e2f7965052cef141\` ON \`pinnzzxc_estock\`.\`businessPartners\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`lines\` ADD CONSTRAINT \`FK_6f26464a4192e5aa3c9e01ac887\` FOREIGN KEY (\`headerId\`) REFERENCES \`pinnzzxc_estock\`.\`transactions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD CONSTRAINT \`FK_8ddeb9b8dde609a7cdfda2e59c6\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`pinnzzxc_estock\`.\`warehouses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD CONSTRAINT \`FK_b59c6f74eb49c26ae8bdc73d2e8\` FOREIGN KEY (\`businessPartnerId\`) REFERENCES \`pinnzzxc_estock\`.\`businessPartners\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP FOREIGN KEY \`FK_b59c6f74eb49c26ae8bdc73d2e8\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` DROP FOREIGN KEY \`FK_8ddeb9b8dde609a7cdfda2e59c6\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`lines\` DROP FOREIGN KEY \`FK_6f26464a4192e5aa3c9e01ac887\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_c34b868d63e2f7965052cef141\` ON \`pinnzzxc_estock\`.\`businessPartners\` (\`contactId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_65f3cf5ac9c203a8880206d33c\` ON \`pinnzzxc_estock\`.\`businessPartners\` (\`addressId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_f3d5b8e8830f97a921a3bb2690\` ON \`pinnzzxc_estock\`.\`contacts\` (\`addressId\`)`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD CONSTRAINT \`FK_b59c6f74eb49c26ae8bdc73d2e8\` FOREIGN KEY (\`businessPartnerId\`) REFERENCES \`pinnzzxc_estock\`.\`businessPartners\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`transactions\` ADD CONSTRAINT \`FK_8ddeb9b8dde609a7cdfda2e59c6\` FOREIGN KEY (\`warehouseId\`) REFERENCES \`pinnzzxc_estock\`.\`warehouses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`lines\` ADD CONSTRAINT \`FK_6f26464a4192e5aa3c9e01ac887\` FOREIGN KEY (\`headerId\`) REFERENCES \`pinnzzxc_estock\`.\`transactions\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
