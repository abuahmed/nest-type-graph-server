import {MigrationInterface, QueryRunner} from "typeorm";

export class dropCodeFromItems1632918498743 implements MigrationInterface {
    name = 'dropCodeFromItems1632918498743'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_1b0a705ce0dc5430c020a0ec31\` ON \`pinnzzxc_estock\`.\`items\``);
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`items\` DROP COLUMN \`code\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pinnzzxc_estock\`.\`items\` ADD \`code\` varchar(255) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_1b0a705ce0dc5430c020a0ec31\` ON \`pinnzzxc_estock\`.\`items\` (\`code\`)`);
    }

}
