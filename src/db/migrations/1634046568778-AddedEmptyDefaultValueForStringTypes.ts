import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedEmptyDefaultValueForStringTypes1634046568778 implements MigrationInterface {
    name = 'AddedEmptyDefaultValueForStringTypes1634046568778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` CHANGE \`fullName\` \`fullName\` varchar(255) NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` CHANGE \`code\` \`code\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`tinNumber\` \`tinNumber\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`vatNumber\` \`vatNumber\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`code\` \`code\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`categories\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`items\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`subCity\` \`subCity\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`streetAddress\` \`streetAddress\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`woreda\` \`woreda\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`kebele\` \`kebele\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`houseNumber\` \`houseNumber\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`telephone\` \`telephone\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateTelephone\` \`alternateTelephone\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`mobile\` \`mobile\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateMobile\` \`alternateMobile\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`email\` \`email\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateEmail\` \`alternateEmail\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`webAddress\` \`webAddress\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`fax\` \`fax\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`poBox\` \`poBox\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`notes\` \`notes\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`roles\` CHANGE \`description\` \`description\` varchar(255) NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`roles\` CHANGE \`descriptionShort\` \`descriptionShort\` varchar(255) NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`roles\` CHANGE \`descriptionShort\` \`descriptionShort\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`roles\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`notes\` \`notes\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`poBox\` \`poBox\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`fax\` \`fax\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`webAddress\` \`webAddress\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateEmail\` \`alternateEmail\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`email\` \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateMobile\` \`alternateMobile\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`mobile\` \`mobile\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`alternateTelephone\` \`alternateTelephone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`telephone\` \`telephone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`houseNumber\` \`houseNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`kebele\` \`kebele\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`woreda\` \`woreda\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`streetAddress\` \`streetAddress\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`addresses\` CHANGE \`subCity\` \`subCity\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`clients\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`organizations\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`warehouses\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`items\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`categories\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`code\` \`code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`vatNumber\` \`vatNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`tinNumber\` \`tinNumber\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`businessPartners\` CHANGE \`description\` \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`salesPersons\` CHANGE \`code\` \`code\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`contacts\` CHANGE \`fullName\` \`fullName\` varchar(255) NOT NULL`);
    }

}
