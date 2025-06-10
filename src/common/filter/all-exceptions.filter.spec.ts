// filters/all-exceptions.filter.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { LoggingService } from '../logging/logging.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AllExceptionsFilter,
        {
          provide: LoggingService,
          useValue: createMock<LoggingService>(),
        },
      ],
    }).compile();

    filter = module.get<AllExceptionsFilter>(AllExceptionsFilter);
    loggingService = module.get(LoggingService);
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    const host = createMock<any>({
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
        getRequest: () => ({
          url: '/test',
          method: 'GET',
          headers: { 'x-correlation-id': 'test-id' },
        }),
      }),
    });

    filter.catch(exception, host);

    expect(loggingService.error).toHaveBeenCalledWith(
      'Request failed',
      expect.objectContaining({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Test error',
      }),
    );
  });
});
