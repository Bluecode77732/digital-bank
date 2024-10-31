// security/rate-limit.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
    private readonly windowMs = 15 * 60 * 1000; // 15 minutes
    private readonly maxRequests = 100; // Maximum requests per window

    constructor(
        private readonly cacheService: CacheService,
        private readonly loggingService: LoggingService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const clientIp = request.ip;
        const key = `ratelimit:${clientIp}`;

        try {
            const currentRequests = await this.cacheService.get<number>(key) || 0;

            if (currentRequests >= this.maxRequests) {
                this.loggingService.warn('Rate limit exceeded', {
                    ip: clientIp,
                    requests: currentRequests,
                });

                throw new HttpException({
                    message: 'Too many requests',
                    remainingTime: await this.getRemainingTime(key),
                }, HttpStatus.TOO_MANY_REQUESTS);
            }

            await this.cacheService.set(key, currentRequests + 1, Math.floor(this.windowMs / 1000));
            return true;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.loggingService.error('Rate limit check failed', { error, ip: clientIp });
            return true; // Fail open if cache is unavailable
        }
    }

    private async getRemainingTime(key: string): Promise<number> {
        const ttl = await this.cacheService.get<number>(`${key}:ttl`);
        return ttl || this.windowMs;
    }
}
