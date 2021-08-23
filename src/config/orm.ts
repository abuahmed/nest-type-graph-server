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
  synchronize: true,
  logging: true,
  entities: [path.resolve(__dirname, '..', 'db', 'models', '*')],
  migrations: [path.resolve(__dirname, '..', 'db', 'migrations', '*')],
  cache: {
    duration: 300000, // 5 minutes cache enabled
  },
};

module.exports = options;
