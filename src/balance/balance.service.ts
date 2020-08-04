import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as _ from 'lodash';
import { Balance } from './entity/balance.entity';
import { CurrencyEnum } from '../enum/currency.enum';

/**
 * Balance service for working with balance clients
 */
@Injectable()
export class BalanceService {
  /**
   * The "constructor"
   *
   * @param balanceRepository
   */
  constructor(
    @InjectRepository(Balance) private balanceRepository: Repository<Balance>,
  ) {}

  /**
   * Create new balance
   *
   * @returns {Promise<Balance>} created balance
   * @param clientId
   * @param currency
   */
  async create(clientId: string, currency: CurrencyEnum): Promise<Balance> {
    const balance = _.assignIn({
      currency,
      clientId,
    });

    return this.balanceRepository.save(balance);
  }

  /**
   * Get balance
   *
   * @returns {Promise<Balance>} client with id
   * @param id
   */
  async get(id: string): Promise<Balance> {
    return this.balanceRepository.findOne({
      where: [{ id }],
    });
  }
}
