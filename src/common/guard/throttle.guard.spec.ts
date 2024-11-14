// guards/throttle.guard.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottleGuard } from './throttle.guard';
import { RateLimitGuard } from '../security/rate-limit.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('ThrottleGuard', () => {
  let guard: ThrottleGuard;
  let rateLimitGuard: jest.Mocked<RateLimitGuard>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThrottleGuard,
        {
          provide: RateLimitGuard,
          useValue: createMock<RateLimitGuard>(),
        },
      ],
    }).compile();

    guard = module.get<ThrottleGuard>(ThrottleGuard);
    rateLimitGuard = module.get(RateLimitGuard);
  });

  it('should delegate to RateLimitGuard', async () => {
    const context = createMock<ExecutionContext>();
    rateLimitGuard.canActivate.mockResolvedValue(true);

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
    expect(rateLimitGuard.canActivate).toHaveBeenCalledWith(context);
  });
});
