import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;

const options: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  database: 'pinnzzxc_estock',
  logging: false,
  entities: [path.resolve(__dirname, '..', 'db', 'models', '*')],
  synchronize: true,
  migrationsRun: true,
  migrations: [path.resolve(__dirname, '..', 'db', 'migrations', '*')],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'src/db/migrations',
  },
};

module.exports = options;
