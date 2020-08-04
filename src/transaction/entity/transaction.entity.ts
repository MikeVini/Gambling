import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurrencyEnum } from '../../enum/currency.enum';
import { StatusEnum } from '../../enum/status.enum';

/**
 * Transaction entity class
 */
@Entity('transaction')
export class Transaction extends BaseEntity {
  /**
   * Unique ID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Client ID
   *
   */
  @PrimaryColumn('uuid')
  clientId: string;

  /**
   * User ID
   *
   */
  @PrimaryColumn('uuid')
  userId: string;

  /**
   * Debit symbol currency
   *
   */
  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    default: CurrencyEnum.USD,
  })
  debitCurrency: CurrencyEnum;

  /**
   * Debit amount
   *
   */
  @Column({ length: 255, default: '0' })
  debitAmount: string;

  /**
   * Debit fee
   *
   */
  @Column({ length: 255, default: '0' })
  debitFee: string;

  /**
   * Credit symbol currency
   *
   */
  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    default: CurrencyEnum.NRON,
  })
  creditCurrency: CurrencyEnum;

  /**
   * Credit amount
   *
   */
  @Column({ length: 255, default: '0' })
  creditAmount: string;

  /**
   * Credit fee
   *
   */
  @Column({ length: 255, default: '0' })
  creditFee: string;

  /**
   * Status transaction
   *
   */
  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.NEW,
  })
  status: StatusEnum;

  /**
   * ID trx in acquiring
   *
   */
  @Column({ length: 255, default: '0' })
  acquiringId: string;

  /**
   * ID trx in exchange
   *
   */
  @Column({ length: 255, default: '0' })
  exchangeId: string;

  /**
   * Date the transaction record was created
   *
   */
  @CreateDateColumn()
  createdAt?: Date;

  /**
   * Date the transaction record was updated
   *
   */
  @UpdateDateColumn()
  updatedAt?: Date;
}
