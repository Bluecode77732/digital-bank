import { Injectable, Logger } from "@nestjs/common";

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
