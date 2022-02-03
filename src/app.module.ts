import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    UserModule,
    DatabaseModule,
    AuthenticationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
