// logging/logging.service.ts
import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { Format } from 'logform';

@Injectable()
export class LoggingService {
    private readonly logger: winston.Logger;

    constructor(
        private readonly config: {
            level: string;
            serviceName: string;
            environment: string;
        },
    ) {
        this.logger = winston.createLogger({
            level: config.level || 'info',
            format: this.createLogFormat(),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.File({
                    filename: 'error.log',
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
                new winston.transports.File({
                    filename: 'combined.log',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
            ],
        });
    }

    private createLogFormat(): Format {
        return winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json(),
            winston.format.metadata({
                fillWith: ['timestamp', 'service', 'environment'],
            }),
            winston.format.printf(({ level, message, metadata, ...rest }) => {
                return JSON.stringify({
                    level,
                    message,
                    timestamp: metadata.timestamp,
                    service: this.config.serviceName,
                    environment: this.config.environment,
                    ...rest,
                });
            }),
        );
    }

    error(message: string, meta?: {}): void {
        this.logger.error(message, { metadata: meta });
    }

    warn(message: string, meta?: any): void {
        this.logger.warn(message, { metadata: meta });
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, { metadata: meta });
    }

    debug(message: string, meta?: any): void {
        this.logger.debug(message, { metadata: meta });
    }

    async flush(): Promise<void> {
        await Promise.all(
            this.logger.transports.map((t: any) =>
                new Promise((resolve) => t.on('finish', resolve))
            )
        );
    }
}



/* import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class LoggingService {
    private readonly logger = new Logger(LoggingService.name);

    log(message: string) {
        this.logger.log(message);
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, trace);
    }
}
*/
