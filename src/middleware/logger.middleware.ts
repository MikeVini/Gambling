import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Class Logger Middleware
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  /**
   * Logger
   */
  private readonly myLogger = new Logger();

  /**
   * Use logger
   *
   * @param req
   * @param res
   * @param next
   */
  use(req: Request, res: Response, next: Function) {
    const message = {
      headers: req.headers,
      baseUrl: req.baseUrl,
      url: req.url,
      body: req.body,
      params: req.query,
    };
    this.myLogger.debug('Incoming message:');
    this.myLogger.debug(message);
    next();
  }
}
