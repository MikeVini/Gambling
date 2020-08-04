import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as _ from 'lodash';
import { Client } from '../client/entity/client.entity';

/**
 * The AuthGuard class is used for checking the access level and validating the request
 */
@Injectable()
export class AuthGuard implements CanActivate {
  /**
   * Logger
   */
  private readonly myLogger = new Logger();

  /**
   * The "constructor"
   *
   * @param reflector
   * @param clientRepository
   */
  constructor(
    private reflector: Reflector,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
  ) {}

  /**
   *
   * @param context
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.validateRequest(request, roles);
  }

  /**
   * Validate request
   *
   * @returns {Promise<Balance>} created balance
   * @param request
   * @param roles
   */
  async validateRequest(request: Request, roles: string[]): Promise<boolean> {
    const hmac = request.headers['hmac-sha512'];
    const merchantId = request.headers['merchant-id'];
    const dateTime = request.headers['date-time'];
    const parameters = _.assignIn(
      { 'date-time': dateTime, path: request.url },
      request.body,
    );
    const authParams = {
      merchantId,
      hmac,
      parameters,
    };

    this.myLogger.debug('Auth ');
    this.myLogger.debug(authParams);

    if (!hmac || !merchantId) {
      this.myLogger.debug('Required headers are not set');

      return false;
    }

    const client = await this.clientRepository.findOne({ id: merchantId });
    if (!client || !client.secret) {
      this.myLogger.debug('Merchant not found');

      return false;
    }

    if (roles.length && roles.indexOf(client.role.toString()) === -1) {
      this.myLogger.debug('Role does not match the query');

      return false;
    }

    const hmacForAuth = await this.getHmac(parameters, 'sha512', client.secret);

    this.myLogger.debug(hmacForAuth);

    return hmac === hmacForAuth;
  }

  /**
   * Get hmac for users parameters
   *
   * @param parameters
   * @param algorithm
   * @param secret
   */
  async getHmac(
    parameters,
    algorithm: string,
    secret: string,
  ): Promise<string> {
    if (typeof parameters === 'object') {
      parameters = JSON.stringify(parameters).replace(/%20/g, '+');
    }

    this.myLogger.debug(parameters);
    return crypto
      .createHmac(algorithm, secret)
      .update(parameters)
      .digest('hex');
  }
}
