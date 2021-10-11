import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedAddressToHaveOneToOneRelations1633967633091 implements MigrationInterface {
    name = 'updatedAddressToHaveOneToOneRelations1633967633091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` DROP FOREIGN KEY \`FK_f3d5b8e8830f97a921a3bb2690e\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` DROP FOREIGN KEY \`FK_9440000e6b8e9e636286dc0625d\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_65f3cf5ac9c203a8880206d33cc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_c34b868d63e2f7965052cef1414\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` DROP COLUMN \`contactId\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` ADD UNIQUE INDEX \`IDX_f3d5b8e8830f97a921a3bb2690\` (\`addressId\`)`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD UNIQUE INDEX \`IDX_65f3cf5ac9c203a8880206d33c\` (\`addressId\`)`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD UNIQUE INDEX \`IDX_c34b868d63e2f7965052cef141\` (\`contactId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_f3d5b8e8830f97a921a3bb2690\` ON \`pinnzzxc_estock\`.\`contacts\` (\`addressId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_65f3cf5ac9c203a8880206d33c\` ON \`pinnzzxc_estock\`.\`businessPartners\` (\`addressId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c34b868d63e2f7965052cef141\` ON \`pinnzzxc_estock\`.\`businessPartners\` (\`contactId\`)`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` ADD CONSTRAINT \`FK_f3d5b8e8830f97a921a3bb2690e\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_65f3cf5ac9c203a8880206d33cc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_c34b868d63e2f7965052cef1414\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_c34b868d63e2f7965052cef1414\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP FOREIGN KEY \`FK_65f3cf5ac9c203a8880206d33cc\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` DROP FOREIGN KEY \`FK_f3d5b8e8830f97a921a3bb2690e\``);
        await queryRunner.query(`DROP INDEX \`REL_c34b868d63e2f7965052cef141\` ON \`pinnzzxc_estock\`.\`businessPartners\``);
        await queryRunner.query(`DROP INDEX \`REL_65f3cf5ac9c203a8880206d33c\` ON \`pinnzzxc_estock\`.\`businessPartners\``);
        await queryRunner.query(`DROP INDEX \`REL_f3d5b8e8830f97a921a3bb2690\` ON \`pinnzzxc_estock\`.\`contacts\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP INDEX \`IDX_c34b868d63e2f7965052cef141\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP INDEX \`IDX_65f3cf5ac9c203a8880206d33c\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` DROP INDEX \`IDX_f3d5b8e8830f97a921a3bb2690\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` ADD \`contactId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_c34b868d63e2f7965052cef1414\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD CONSTRAINT \`FK_65f3cf5ac9c203a8880206d33cc\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` ADD CONSTRAINT \`FK_9440000e6b8e9e636286dc0625d\` FOREIGN KEY (\`contactId\`) REFERENCES \`pinnzzxc_estock\`.\`contacts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` ADD CONSTRAINT \`FK_f3d5b8e8830f97a921a3bb2690e\` FOREIGN KEY (\`addressId\`) REFERENCES \`pinnzzxc_estock\`.\`addresses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
