import {MigrationInterface, QueryRunner} from "typeorm";

export class addedOnDeleteCascadeForAddressId1633954870020 implements MigrationInterface {
    name = 'addedOnDeleteCascadeForAddressId1633954870020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` DROP FOREIGN KEY \`FK_f3d5b8e8830f97a921a3bb2690e\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` DROP FOREIGN KEY \`FK_9440000e6b8e9e636286dc0625d\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` DROP FOREIGN KEY \`FK_67c4d10f39fdc8a0bbfccdcf73a\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` DROP FOREIGN KEY \`FK_25b6541b65a1e6d380b6f0f7858\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` DROP FOREIGN KEY \`FK_c165d42d73eebe548d70a649bfc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_65f3cf5ac9c203a8880206d33cc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_c34b868d63e2f7965052cef1414\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` ADD CONSTRAINT \`FK_f3d5b8e8830f97a921a3bb2690e\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` ADD CONSTRAINT \`FK_9440000e6b8e9e636286dc0625d\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` ADD CONSTRAINT \`FK_67c4d10f39fdc8a0bbfccdcf73a\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` ADD CONSTRAINT \`FK_25b6541b65a1e6d380b6f0f7858\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` ADD CONSTRAINT \`FK_c165d42d73eebe548d70a649bfc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_65f3cf5ac9c203a8880206d33cc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_c34b868d63e2f7965052cef1414\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_c34b868d63e2f7965052cef1414\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_65f3cf5ac9c203a8880206d33cc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` DROP FOREIGN KEY \`FK_c165d42d73eebe548d70a649bfc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` DROP FOREIGN KEY \`FK_25b6541b65a1e6d380b6f0f7858\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` DROP FOREIGN KEY \`FK_67c4d10f39fdc8a0bbfccdcf73a\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` DROP FOREIGN KEY \`FK_9440000e6b8e9e636286dc0625d\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` DROP FOREIGN KEY \`FK_f3d5b8e8830f97a921a3bb2690e\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_c34b868d63e2f7965052cef1414\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_65f3cf5ac9c203a8880206d33cc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` ADD CONSTRAINT \`FK_c165d42d73eebe548d70a649bfc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` ADD CONSTRAINT \`FK_25b6541b65a1e6d380b6f0f7858\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` ADD CONSTRAINT \`FK_67c4d10f39fdc8a0bbfccdcf73a\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` ADD CONSTRAINT \`FK_9440000e6b8e9e636286dc0625d\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` ADD CONSTRAINT \`FK_f3d5b8e8830f97a921a3bb2690e\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
