import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import LogsMiddleware from './modules/logger/logs.middleware';
import { LoggerModule } from './modules/logger/logger.module';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { WinstonLoggerService } from './shared/services/winstonLoggerService';
import { EmailModule } from './modules/email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
const wlogger:any = new WinstonLoggerService();
@Module({
  imports: [
    LoggerModule,
    WinstonModule.forRoot(wlogger.getLoggerConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    UserModule,
    DatabaseModule,
    AuthenticationModule,
    EmailModule,
    ScheduleModule.forRoot()
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
