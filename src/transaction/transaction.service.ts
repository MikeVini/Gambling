import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionDto } from './dto/transaction.dto';
import * as _ from 'lodash';
import { UsersClients } from '../user/entity/users-clients.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CurrencyEnum } from '../enum/currency.enum';
import { ConfigService } from '@nestjs/config';
import { BigNumber } from 'bignumber.js';
import { GetTransactionsDto } from './dto/get-transactions.dto';

/**
 * Transaction service for working with user`s transaction
 */
@Injectable()
export class TransactionService {
  /**
   * Rate NRON crypto
   */
  readonly nronRate = this.configService.get('NRON_RATE', 100);
  /**
   * The "constructor"
   *
   * @param transactionRepository
   * @param usersClientsRepository
   * @param configService
   */
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(UsersClients)
    private readonly usersClientsRepository: Repository<UsersClients>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create new transaction
   *
   * @returns {Promise<Transaction>} created Transaction
   * @param createTransactionDto
   */
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    if (createTransactionDto.debitCurrency !== CurrencyEnum.USD) {
      throw new HttpException(
        `${createTransactionDto.debitCurrency} not supported`,
        500,
      );
    }

    const transactionExists = await this.transactionRepository.findOne({
      acquiringId: createTransactionDto.acquiringId,
    });

    if (transactionExists) {
      throw new NotFoundException('Transaction already exists');
    }

    const clientId = createTransactionDto.clientId;
    const userExists = await this.usersClientsRepository.findOne({
      userId: createTransactionDto.userId,
      clientId,
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const creditAmount = new BigNumber(createTransactionDto.debitAmount)
      .div(this.nronRate)
      .toFixed(2);
    const transaction = _.assignIn(new Transaction(), createTransactionDto, {
      creditAmount,
    });
    return new TransactionDto(
      await this.transactionRepository.save(transaction),
    );
  }

  /**
   * Get transaction by id
   *
   * @returns {Promise<Transaction>} client with id
   * @param id
   * @param clientId
   */
  async getTransaction(id: string, clientId: string): Promise<TransactionDto> {
    const transaction = await this.transactionRepository.findOne({ id });

    if (transaction && transaction.clientId === clientId) {
      return new TransactionDto(transaction);
    } else {
      throw new NotFoundException('Transaction not found');
    }
  }

  /**
   * Get transactions
   *
   * @returns {Promise<Transaction>} client with id
   * @param getTransactionsDto
   * @param clientId
   */
  async getTransactions(
    getTransactionsDto: GetTransactionsDto,
    clientId: string,
  ): Promise<TransactionDto[]> {
    const transaction = await this.transactionRepository.find({
      where: {
        clientId,
      },
      order: {
        [getTransactionsDto.sortBy]: getTransactionsDto.sortDirection,
      },
      skip: getTransactionsDto.skip,
      take: getTransactionsDto.limit,
    });

    return transaction;
  }
}
