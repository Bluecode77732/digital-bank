import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class CacheService {
    private readonly redis: Redis;
    private readonly defaultTTL = 3600; // 1 hour in seconds

    constructor(
        private readonly loggingService: LoggingService,
        private readonly config: {
            host: string;
            port: number;
            password: string;
        },
    ) {
        this.redis = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            reconnectOnError: (err: Error) => {
                this.loggingService.error('Redis connection error', `error: ${err}`);  //Should { error: err } need in here?
                return true;
            },
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.loggingService.error('Cache get error', `error: ${key}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            this.loggingService.error('Cache set error', `error: ${key}`);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            this.loggingService.error('Cache delete error', `error: ${key}`);
        }
    }

    async clearNamespace(namespace: string): Promise<void> {
        try {
            const keys = await this.redis.keys(`${namespace}:*`);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        } catch (error) {
            this.loggingService.error('Cache clear namespace error', `error: ${namespace}`);
        }
    }
}
