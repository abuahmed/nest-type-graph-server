import {MigrationInterface, QueryRunner} from "typeorm";

export class addOutstandingCreditsColumns1633104844402 implements MigrationInterface {
    name = 'addOutstandingCreditsColumns1633104844402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD \`creditTransactionsLimit\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD \`creditsWithoutCheck\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD \`totalOutstandingCredit\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD \`initialOutstandingCredit\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` ADD \`noOfOutstandingTransactions\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP COLUMN \`noOfOutstandingTransactions\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP COLUMN \`initialOutstandingCredit\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP COLUMN \`totalOutstandingCredit\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP COLUMN \`creditsWithoutCheck\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` DROP COLUMN \`creditTransactionsLimit\``);
    }

}
