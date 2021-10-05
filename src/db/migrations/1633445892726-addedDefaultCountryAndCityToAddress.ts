import {MigrationInterface, QueryRunner} from "typeorm";

export class addedDefaultCountryAndCityToAddress1633445892726 implements MigrationInterface {
    name = 'addedDefaultCountryAndCityToAddress1633445892726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`country\` \`country\` varchar(255) NOT NULL DEFAULT 'Ethiopia'`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`city\` \`city\` varchar(255) NOT NULL DEFAULT 'Addis Ababa'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`city\` \`city\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`country\` \`country\` varchar(255) NOT NULL`);
    }

}
