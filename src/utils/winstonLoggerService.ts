import { utilities as nestWinstonModuleUtilities} from 'nest-winston';

const { format, transports } = require('winston');
require('winston-daily-rotate-file');
import * as path from 'path';

export class WinstonLoggerService {
  private logger: any;
  private transports: any = [];
  private exceptionHandlers: any = [];
  private async initialize() {
    this.transports = [this.getDailyRotateFileLogger('app')];
    this.exceptionHandlers = [this.getDailyRotateFileLogger('exceptions')];
    if (process.env.NODE_ENV !== 'production') {
      this.transports.push(new transports.Console({
        format: nestWinstonModuleUtilities.format.nestLike(),
      }));
      this.exceptionHandlers.push(new transports.Console());
    }
    this.logger = {
      format: format.combine(
        format.printf(
          (info) =>
            `${info.timestamp} ${info.level} [${info.context}] :  ${info.message}` +
            (info.splat !== undefined ? `${info.splat}` : ' '),
        ),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.json(),
      ),
      transports: this.transports,
      exceptionHandlers: this.exceptionHandlers,
    }
    return true;
  }
  private getDailyRotateFileLogger(fileName: string) {
    return new transports.DailyRotateFile({
      filename: path.join(__dirname, "..", "..", `logs/${fileName}-%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '10d',
      json: true,
    });
  }

  getLoggerConfig() {
    this.initialize();
    return this.logger
  }
 }