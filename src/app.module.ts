import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import LogsMiddleware from './modules/logs/logs.middleware';
import { LoggerModule } from './modules/logs/logger.module';
import * as winston from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

@Module({
  imports: [
    LoggerModule,
    WinstonModule.forRootAsync({
      useFactory: () => ({
        format: winston.format.combine(
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf(
            (info) =>
              `${info.timestamp} ${info.level} [${info.context}] :  ${info.message}` +
              (info.splat !== undefined ? `${info.splat}` : ' '),
          ),
        ),
        transports: [
          new winston.transports.Console({
            format: nestWinstonModuleUtilities.format.nestLike(),
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'debug.log',
            level: 'debug',
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'info.log',
            level: 'info',
          }),
          new winston.transports.File({
            dirname: 'log',
            filename: 'error.log',
            level: 'error',
          }),
        ],
      }),
      inject: [],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    UserModule,
    DatabaseModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
