import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import * as _ from 'lodash';

/**
 * Exchange service for working with Exchange, e.g. register
 * r
 */
@Injectable()
export class ExchangeService {
  /**
   * Secret API_KEY exchange
   */
  readonly secret = this.configService.get('API_KEY_EXCHANGE');

  /**
   * The "constructor"
   *
   * @param httpService
   * @param configService
   */
  constructor(
    private httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * sendMessage user|client in Exchange
   *
   * *@returns {Promise<string,string>} identityId and temporary password (if the user was created)
   *
   * @param params an object containing the request parameters for the exchange
   */
  async sendMessage(params: AxiosRequestConfig): Promise<any> {
    const date = new Date();
    const dateTime = date.getTime().toString();
    const parameters = _.assignIn(
      { 'date-time': dateTime, path: params.url },
      params.data,
    );
    const hmac = await this.getHmac(parameters, 'sha512', this.secret);
    params['headers'] = { 'hmac-sha512': hmac, 'date-time': dateTime };

    return this.httpService
      .request(params)
      .toPromise()
      .then(res => res.data)
      .catch(e => {
        if (e.response && e.response.data && e.response.data.message) {
          throw new HttpException(e.response.data.message, e.response.status);
        } else {
          const httpCode = 503;
          throw new HttpException(HttpStatus[httpCode], httpCode);
        }
      });
  }

  /**
   * getHmac generate hmac for Exchange API
   *
   * *@returns {Promise<string,string>} identityId and temporary password (if the user was created)
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

    return crypto
      .createHmac(algorithm, secret)
      .update(parameters)
      .digest('hex');
  }
}
