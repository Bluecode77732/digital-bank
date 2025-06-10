import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitGuard } from './rate-limit.guard';
import { CacheService } from '../cache/cache.service';
import { LoggingService } from '../logging/logging.service';
import { HttpException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('RateLimitGuard', () => {
    let guard: RateLimitGuard;
    let cacheService: jest.Mocked<CacheService>;
    let loggingService: jest.Mocked<LoggingService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RateLimitGuard,
                {
                    provide: CacheService,
                    useValue: createMock<CacheService>(),
                },
                {
                    provide: LoggingService,
                    useValue: createMock<LoggingService>(),
                },
            ],
        }).compile();

        guard = module.get<RateLimitGuard>(RateLimitGuard);
        cacheService = module.get(CacheService);
        loggingService = module.get(LoggingService);
    });

    it('should allow request within limit', async () => {
        const context = createMock<any>({
            switchToHttp: () => ({
                getRequest: () => ({
                    ip: '127.0.0.1',
                }),
            }),
        });

        cacheService.get.mockResolvedValue(50);
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
    });

    it('should block request exceeding limit', async () => {
        const context = createMock<any>({
            switchToHttp: () => ({
                getRequest: () => ({
                    ip: '127.0.0.1',
                }),
            }),
        });

        cacheService.get.mockResolvedValue(100);
        await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
        expect(loggingService.warn).toHaveBeenCalled();
    });
});
