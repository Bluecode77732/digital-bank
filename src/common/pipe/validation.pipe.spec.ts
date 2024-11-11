// pipes/validation.pipe.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';
import { LoggingService } from '../logging/logging.service';
import { BadRequestException } from '@nestjs/common';
import { IsString } from 'class-validator';

class TestDto {
  @IsString()
  name: string;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;
  let loggingService: jest.Mocked<LoggingService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationPipe,
        {
          provide: LoggingService,
          useValue: createMock<LoggingService>(), //What is <>? Smth like a genetic type?
        },
      ],
    }).compile();

    pipe = module.get<ValidationPipe>(ValidationPipe);
    loggingService = module.get(LoggingService);
  });

  it('should validate correct data', async () => {
    const testData = { name: 'test' };
    const result = await pipe.transform(testData, { metatype: TestDto });
    expect(result).toEqual(testData);
  });

  it('should throw BadRequestException for invalid data', async () => {
    const testData = { name: 123 };
    await expect(pipe.transform(testData, { metatype: TestDto }))
      .rejects.toThrow(BadRequestException);
    expect(loggingService.warn).toHaveBeenCalled();
  });
});
