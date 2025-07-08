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
