import { Test, TestingModule } from '@nestjs/testing';
import { LoggingService } from './logging.service';
import * as winston from 'winston';

jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
    }),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        errors: jest.fn(),
        json: jest.fn(),
        metadata: jest.fn(),
        printf: jest.fn(),
        colorize: jest.fn(),
        simple: jest.fn(),
    },
    transports: {
        Console: jest.fn(),
        File: jest.fn(),
    },
}));

describe('LoggingService', () => {
    let service: LoggingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: LoggingService,
                    useFactory: () => new LoggingService({
                        level: 'info',
                        serviceName: 'test-service',
                        environment: 'test',
                    }),
                },
            ],
        }).compile();

        service = module.get<LoggingService>(LoggingService);
    });

    it('should create winston logger with correct config', () => {
        expect(winston.createLogger).toHaveBeenCalled();
        expect(winston.transports.Console).toHaveBeenCalled();
        expect(winston.transports.File).toHaveBeenCalledTimes(2);
    });

    it('should log messages with metadata', () => {
        const message = 'test message';
        const metadata = { test: 'data' };

        service.error(message, metadata);
        service.warn(message, metadata);
        service.info(message, metadata);
        service.debug(message, metadata);

        const logger = (winston.createLogger as jest.Mock).mock.results[0].value;
        expect(logger.error).toHaveBeenCalledWith(message, { metadata });
        expect(logger.warn).toHaveBeenCalledWith(message, { metadata });
        expect(logger.info).toHaveBeenCalledWith(message, { metadata });
        expect(logger.debug).toHaveBeenCalledWith(message, { metadata });
    });
});
