import { IsNotEmpty, Length, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../enum/currency.enum';
import { StatusEnum } from '../../enum/status.enum';

/**
 * TransactionDto dto class
 */
export class TransactionDto {
  /**
   * Unique Trx ID
   */
  @MaxLength(36)
  id: string;

  /**
   * Client ID
   *
   */
  @ApiHideProperty()
  @Exclude()
  clientId: string;

  /**
   * User ID
   *
   */
  @MaxLength(36)
  @IsNotEmpty()
  userId: string;

  /**
   * Debit symbol currency
   *
   */
  @Length(1, 36)
  debitCurrency: CurrencyEnum;

  /**
   * Debit amount
   *
   */
  @Length(1, 255)
  debitAmount: string;

  /**
   * Debit fee
   *
   */
  @Length(1, 255)
  debitFee: string;

  /**
   * Credit symbol currency
   *
   */
  @Length(1, 36)
  creditCurrency: CurrencyEnum;

  /**
   * Credit amount
   *
   */
  @Length(1, 255)
  creditAmount: string;

  /**
   * Credit fee
   *
   */
  @Length(1, 255)
  creditFee: string;

  /**
   * Status transaction
   *
   */
  @Length(1, 36)
  status: StatusEnum;

  /**
   * ID trx in acquiring
   *
   */
  @MaxLength(255)
  acquiringId: string;

  /**
   * ID trx in exchange
   *
   */
  @MaxLength(255)
  exchangeId: string;

  /**
   * The "constructor"
   *
   * @param partial
   */
  constructor(partial?: Partial<TransactionDto>) {
    Object.assign(this, partial);
  }
}
