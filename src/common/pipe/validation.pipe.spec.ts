// pipes/validation.pipe.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from './validation.pipe';
import { LoggingService } from '../logging/logging.service';
import { BadRequestException } from '@nestjs/common';
import { IsString } from 'class-validator';
import { createMock } from '@golevelup/ts-jest';

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
    const result = await pipe.transform(testData, { metatype : TestDto, type : 'body' });  //!{ metatype : TestDto } : The ArgumentMetadata type expects an object with a type property.
    expect(result).toEqual(testData);
  });

  it('should throw BadRequestException for invalid data', async () => {
    const testData = { name: 123 };
    await expect(pipe.transform(testData, { type: 'body', metatype: TestDto }))
      .rejects.toThrow(BadRequestException);
    expect(loggingService.warn).toHaveBeenCalled();
  });
});



/* // pipes/validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { LoggingService } from '../logging/logging.service';


//* Smart validation pipe that ensures all incoming data is safe and valid
//* Especially important for financial transactions and sensitive banking data
 
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  constructor(private readonly logger: LoggingService) {}

  async transform(data: any, { metatype }: ArgumentMetadata) {
    // Skip validation if no metatype (type information) is available
    if (!metatype || this.isBasicType(metatype)) {
      return data;
    }

    try {
      // Convert incoming data to a typed object
      const objectToValidate = plainToClass(metatype, data);
      
      // Run validation
      const errors = await validate(objectToValidate, {
        whitelist: true,         // Remove any extra properties
        forbidNonWhitelisted: true, // Throw error if extra props exist
        skipMissingProperties: false, // Ensure all required props are present
      });

      // If validation passed, we're good to go!
      if (errors.length === 0) {
        return objectToValidate;
      }

      // Format validation errors in a user-friendly way
      const prettyErrors = errors.map(error => ({
        field: error.property,
        value: error.value,
        issues: Object.values(error.constraints || {})
      }));

      this.logger.warn('Validation failed', {
        receivedData: data,
        errors: prettyErrors
      });

      throw new BadRequestException({
        message: 'Please check your input and try again',
        details: prettyErrors
      });
    } catch (error) {
      // If something goes wrong during validation itself
      this.logger.error('Validation error', { error, data });
      throw error;
    }
  }

  private isBasicType(metatype: Function): boolean {
    const basicTypes = [String, Boolean, Number, Array, Object];
    return basicTypes.includes(metatype);
  }
}
 */