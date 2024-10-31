import { Injectable, CanActivate, ExecutionContext, ThrottlerGuard, Throttle } from "@nestjs/throttler";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
    constructor(reflector: Reflector) {
        super(reflector);
    }

    //Why is this protected?
    protected async handleRequest(context: ExecutionContext, limit: number, ttl: number) {
        // Custom throttle behavior can be added here
        return super.handleRequest(context, limit, ttl);
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
