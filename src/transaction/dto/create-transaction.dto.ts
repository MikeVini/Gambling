import { IsNotEmpty, Length, MaxLength } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { CurrencyEnum } from '../../enum/currency.enum';
import { StatusEnum } from '../../enum/status.enum';

/**
 * CreateTransactionDto dto class
 */
export class CreateTransactionDto {
  /**
   * Unique client ID
   */
  @ApiHideProperty()
  @Exclude()
  id: string;

  /**
   * Client ID
   *
   */
  @MaxLength(36)
  @IsNotEmpty()
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
  debitCurrency: string;

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
  @ApiHideProperty()
  @Exclude()
  debitFee: string;

  /**
   * Credit symbol currency
   *
   */
  @ApiHideProperty()
  @Exclude()
  creditCurrency: CurrencyEnum;

  /**
   * Credit amount
   *
   */
  @ApiHideProperty()
  @Exclude()
  creditAmount: string;

  /**
   * Credit fee
   *
   */
  @ApiHideProperty()
  @Exclude()
  creditFee: string;

  /**
   * Status transaction
   *
   */
  @ApiHideProperty()
  @Exclude()
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
  @ApiHideProperty()
  @Exclude()
  exchangeId: string;

  /**
   * The "constructor"
   *
   * @param partial
   */
  constructor(partial?: Partial<CreateTransactionDto>) {
    Object.assign(this, partial);
  }
}
