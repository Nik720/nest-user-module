import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseLogger from 'src/modules/logs/databaseLogger';
import Log from 'src/modules/logs/log.entity';
import User from 'src/modules/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                logger: new DatabaseLogger(),
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.user'),
                password: configService.get('database.password'),
                database: configService.get('database.dbname'),
                entities: [
                    User,
                    Log
                ],
                synchronize: true,
            })
        })
    ]
})
export class DatabaseModule {}
