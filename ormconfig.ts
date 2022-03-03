import * as dotenv from 'dotenv';
dotenv.config();

import { ConnectionOptions } from 'typeorm';
import * as fs from 'fs';

let config: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // Auto sync entity changes
  logging: false,
  "entities": ["dist/**/*.entity{ .ts,.js}"],
  migrations: [__dirname + 'src/database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations',
    entitiesDir: 'src/entity',
  },
};

if (process.env.NODE_ENV === 'production') {
  config = {
    ...config,
    ssl: {
      ca: fs.readFileSync(process.env.SSL_PATH),
    },
  };
}

export = config;