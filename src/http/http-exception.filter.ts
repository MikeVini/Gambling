import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { isObject } from 'rxjs/internal-compatibility';

/**
 * Class HttpExceptionFilter for error handling
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * Logger
   */
  private readonly myLogger = new Logger();

  /**
   * Catch exception
   *
   * @param exception
   * @param host
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const body = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: isObject(exception.message)
        ? exception.message.message
        : exception.message,
    };
    this.myLogger.debug(`Error: Response: ${JSON.stringify(body)}`);
    response.status(status).json(body);
  }
}
