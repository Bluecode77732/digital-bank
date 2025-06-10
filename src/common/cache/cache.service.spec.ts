import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { LoggingService } from '../logging/logging.service';
import { createMock } from '@golevelup/ts-jest';
import { Redis } from 'ioredis';

// Mock Redis constructor and instance methods
const mockRedisInstance = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
};

jest.mock('ioredis', () => {
    return {
        Redis: jest.fn().mockImplementation(() => mockRedisInstance)
    };
});

describe('CacheService', () => {
    let service: CacheService;
    let loggingService: jest.Mocked<LoggingService>;
    let redisMock: jest.Mocked<Redis>;

    beforeEach(async () => {
        // Clear mock calls before each test
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CacheService,
                    useFactory: () => new CacheService(
                        createMock<LoggingService>(),
                        {
                            host: 'localhost',
                            port: 6379,
                            password: 'test',
                        },
                    ),
                },
                {
                    provide: LoggingService,
                    useValue: createMock<LoggingService>(),
                },
            ],
        }).compile();

        service = module.get<CacheService>(CacheService);
        loggingService = module.get(LoggingService);
        redisMock = mockRedisInstance as unknown as jest.Mocked<Redis>;
    });

    it('should get cached value', async () => {
        const mockValue = JSON.stringify({ test: 'data' });
        redisMock.get.mockResolvedValue(mockValue);

        const result = await service.get('test-key');
        expect(result).toEqual({ test: 'data' });
        expect(redisMock.get).toHaveBeenCalledWith('test-key');
    });
});
