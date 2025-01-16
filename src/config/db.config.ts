import { registerAs } from '@nestjs/config';
import {config as dotenvConfig} from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({path: '.env'});
const config = {
    type: 'postgres',
    database: `${process.env.DB_NAME}`,
    host: `${process.env.DB_HOST}`,
    port: +process.env.DB_PORT,
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    "ssl": true,
    "extra": {
        "ssl": {
            "rejectUnauthorized": false
        }
    },
    entities: [`dist/**/*.entity{.ts,.js}`],
    migrations: [`dist/**/migrations/*{.ts,.js}`],
    autoLoadEntities: true,
    //dropSchema: true,
    //synchronize: true,
};
export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);