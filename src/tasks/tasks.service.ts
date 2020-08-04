import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Method } from 'axios';
import * as _ from 'lodash';
import { StatusEnum } from '../enum/status.enum';
import { ExchangeService } from '../exchange/exchange.service';
import { Transaction } from '../transaction/entity/transaction.entity';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';

/**
 * Service for tasks
 */
@Injectable()
export class TasksService {
  /**
   * Interval for send transaction
   */
  readonly sendTransactionInterval = this.configService.get(
    'SEND_TRANSACTION_INTERVAL',
    15000,
  );

  /**
   * Interval for check transaction
   */
  readonly checkTransactionInterval = this.configService.get(
    'CHECK_TRANSACTION_INTERVAL',
    17000,
  );

  /**
   * Lock send transaction
   */
  private lockSend = false;

  /**
   * Lock check transaction
   */
  private lockCheck = false;

  /**
   * Logger
   */
  readonly myLogger = new Logger(TasksService.name);

  /**
   * The "constructor"
   *
   * @param exchangeService
   * @param transactionRepository
   * @param clientRepository
   * @param userRepository
   * @param configService
   */
  constructor(
    private readonly exchangeService: ExchangeService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Handler interval
   *
   */
  @Interval(15000)
  async handleIntervalSend(): Promise<void> {
    if (this.lockSend) {
      return;
    }
    try {
      this.lockSend = true;
      this.myLogger.debug(
        `Send transaction in exchange every ${this.sendTransactionInterval /
          1000} seconds`,
      );
      const transactions = await this.transactionRepository.find({
        where: [
          {
            status: StatusEnum.NEW,
          },
        ],
      });
      for (const transaction of transactions) {
        await this.sendTransaction(transaction);
      }
      this.lockSend = false;
    } catch (e) {
      this.myLogger.error(e.message);
      this.lockSend = false;
    } finally {
      this.myLogger.debug('Send transaction in exchange end');
    }
  }

  /**
   * Handler interval
   *
   */
  @Interval(17000)
  async handleIntervalCheck(): Promise<void> {
    if (this.lockCheck) {
      return;
    }
    try {
      this.lockCheck = true;
      this.myLogger.debug(
        `Check transaction in exchange every ${this.checkTransactionInterval /
          1000} seconds`,
      );
      const transactions = await this.transactionRepository.find({
        where: [
          {
            status: StatusEnum.PROCESSING,
          },
        ],
      });
      for (const transaction of transactions) {
        await this.checkTransaction(transaction);
      }
      this.lockCheck = false;
    } catch (e) {
      this.myLogger.error(e.message);
      this.lockCheck = false;
    } finally {
      this.myLogger.debug('Check transaction in exchange end');
    }
  }

  /**
   *
   * @param transaction
   */
  async sendTransaction(transaction: Transaction): Promise<any> {
    try {
      const client = await this.clientRepository.findOne({
        id: transaction.clientId,
      });
      const user = await this.userRepository.findOne({
        id: transaction.userId,
      });
      const method: Method = 'POST';
      const params = {
        url: '/sendTransaction',
        method,
        data: {
          clientId: client.identityId,
          userId: user.identityId,
          amount: transaction.creditAmount,
          currencyId: transaction.creditCurrency,
          additionalData: transaction.id,
        },
      };

      const response = await this.exchangeService.sendMessage(params);
      const exchangeId = _.get(response, 'item.id');
      const exchangeStatus = _.get(response, 'item.status');
      const status =
        exchangeStatus === 'failed' ? StatusEnum.FAIL : StatusEnum.PROCESSING;

      if (exchangeId && exchangeStatus) {
        await this.transactionRepository.update(
          { id: transaction.id },
          { status, exchangeId },
        );
      } else {
        await this.transactionRepository.update(
          { id: transaction.id },
          { status },
        );
      }
    } catch (e) {
      this.myLogger.error(`Error: ${e.status} ${e.message}`);
      await this.transactionRepository.update(
        { id: transaction.id },
        { status: StatusEnum.ERROR },
      );
    }
  }

  /**
   *
   * @param transaction
   */
  async checkTransaction(transaction: Transaction): Promise<any> {
    try {
      const method: Method = 'POST';
      const params = {
        url: '/getTransaction',
        method,
        data: {
          idTxGambling: transaction.id,
        },
      };

      const response = await this.exchangeService.sendMessage(params);
      const trx = _.get(response, 'items');
      if (trx && trx.length === 4 && trx.includes('committed')) {
        await this.transactionRepository.update(
          { id: transaction.id },
          { status: StatusEnum.SUCCESS },
        );
      }
    } catch (e) {
      this.myLogger.error(`Error: ${e.status} ${e.message}`);
      await this.transactionRepository.update(
        { id: transaction.id },
        { status: StatusEnum.ERROR },
      );
    }
  }
}
