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
            exception instanceof HttpException  //What is instanceof meaning?
                ? exception.getStatus() //What is ? and : meaning?
                : HttpStatus.INTERNAL_SERVER_ERROR; //What is ? and : meaning?

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception instanceof HttpException
                ? exception.message //What is ? and : meaning?
                : 'Internal server error',  //What is ? and : meaning?
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
