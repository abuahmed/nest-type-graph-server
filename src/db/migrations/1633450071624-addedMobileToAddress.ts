import {MigrationInterface, QueryRunner} from "typeorm";

export class addedMobileToAddress1633450071624 implements MigrationInterface {
    name = 'addedMobileToAddress1633450071624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` ADD \`mobile\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` ADD \`alternateMobile\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` DROP COLUMN \`alternateMobile\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` DROP COLUMN \`mobile\``);
    }

}
