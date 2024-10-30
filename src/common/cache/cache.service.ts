import { Injectable, Inject } from "@nestjs/common";
import { Cache, CacheModule, CacheInterceptor } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
    constructor(@Inject(Cache) private cache: Cache) { }

    async get<T>(key: string): Promise<T> {
        return await this.cache.get<T>(key);
    }

    async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
        await this.cache.set(key, value, { ttl });
    }

    async del(key: string): Promise<void> {
        await this.cache.del(key);
    }
}


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
                this.loggingService.error('Redis connection error', { error: err });
                return true;
            },
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.loggingService.error('Cache get error', { error, key });
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            this.loggingService.error('Cache set error', { error, key });
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            this.loggingService.error('Cache delete error', { error, key });
        }
    }

    async clearNamespace(namespace: string): Promise<void> {
        try {
            const keys = await this.redis.keys(`${namespace}:*`);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        } catch (error) {
            this.loggingService.error('Cache clear namespace error', { error, namespace });
        }
    }
}



// filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging/logging.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly loggingService: LoggingService) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception instanceof HttpException
                ? exception.message
                : 'Internal server error',
            correlationId: request.headers['x-correlation-id'],
        };

        // Log the error with additional context
        this.loggingService.error('Request failed', {
            error: exception,
            request: {
                url: request.url,
                method: request.method,
                headers: request.headers,
                body: request.body,
            },
            ...errorResponse,
        });

        response
            .status(status)
            .json(errorResponse);
    }
}

// pipes/validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
    constructor(private readonly loggingService: LoggingService) { }

    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        const object = plainToClass(metatype, value);
        const errors = await validate(object, {
            whitelist: true,
            forbidNonWhitelisted: true,
            skipMissingProperties: false,
        });

        if (errors.length > 0) {
            const formattedErrors = errors.map(error => ({
                property: error.property,
                constraints: error.constraints,
                value: error.value,
            }));

            this.loggingService.warn('Validation failed', {
                errors: formattedErrors,
                receivedValue: value,
            });

            throw new BadRequestException({
                message: 'Validation failed',
                errors: formattedErrors,
            });
        }

        return object;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}

// guards/throttle.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { RateLimitGuard } from '../security/rate-limit.guard';

@Injectable()
export class ThrottleGuard implements CanActivate {
    constructor(private readonly rateLimitGuard: RateLimitGuard) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return this.rateLimitGuard.canActivate(context);
    }
}

// cache/cache.service.ts
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
                this.loggingService.error('Redis connection error', { error: err });
                return true;
            },
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            this.loggingService.error('Cache get error', { error, key });
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl: number = this.defaultTTL): Promise<void> {
        try {
            await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            this.loggingService.error('Cache set error', { error, key });
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            this.loggingService.error('Cache delete error', { error, key });
        }
    }

    async clearNamespace(namespace: string): Promise<void> {
        try {
            const keys = await this.redis.keys(`${namespace}:*`);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        } catch (error) {
            this.loggingService.error('Cache clear namespace error', { error, namespace });
        }
    }
}

// security/encryption.service.ts
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';
    private readonly keyLength = 32;
    private readonly ivLength = 16;
    private readonly saltLength = 32;
    private readonly authTagLength = 16;

    constructor(
        private readonly loggingService: LoggingService,
        private readonly config: {
            encryptionKey: string;
        },
    ) { }

    async encrypt(data: string): Promise<string> {
        try {
            const salt = randomBytes(this.saltLength);
            const iv = randomBytes(this.ivLength);

            const key = await promisify(scrypt)(
                this.config.encryptionKey,
                salt,
                this.keyLength,
            ) as Buffer;

            const cipher = createCipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength,
            });

            const encrypted = Buffer.concat([
                cipher.update(data, 'utf8'),
                cipher.final(),
            ]);

            const authTag = cipher.getAuthTag();

            const result = Buffer.concat([
                salt,
                iv,
                authTag,
                encrypted,
            ]).toString('base64');

            return result;
        } catch (error) {
            this.loggingService.error('Encryption failed', { error });
            throw new Error('Encryption failed');
        }
    }

    async decrypt(encryptedData: string): Promise<string> {
        try {
            const buffer = Buffer.from(encryptedData, 'base64');

            const salt = buffer.subarray(0, this.saltLength);
            const iv = buffer.subarray(this.saltLength, this.saltLength + this.ivLength);
            const authTag = buffer.subarray(
                this.saltLength + this.ivLength,
                this.saltLength + this.ivLength + this.authTagLength,
            );
            const encrypted = buffer.subarray(this.saltLength + this.ivLength + this.authTagLength);

            const key = await promisify(scrypt)(
                this.config.encryptionKey,
                salt,
                this.keyLength,
            ) as Buffer;

            const decipher = createDecipheriv(this.algorithm, key, iv, {
                authTagLength: this.authTagLength,
            });
            decipher.setAuthTag(authTag);

            const decrypted = Buffer.concat([
                decipher.update(encrypted),
                decipher.final(),
            ]);

            return decrypted.toString('utf8');
        } catch (error) {
            this.loggingService.error('Decryption failed', { error });
            throw new Error('Decryption failed');
        }
    }
}

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

    error(message: string, meta?: any): void {
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