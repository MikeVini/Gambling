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

/**
 * Balance entity class
 */
@Entity('balance')
export class Balance extends BaseEntity {
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
   * Symbol currency
   *
   */
  @Column({
    type: 'enum',
    enum: CurrencyEnum,
    default: CurrencyEnum.NRON,
  })
  currency: CurrencyEnum;

  /**
   * Amount currency
   *
   */
  @Column({ length: 255, default: '0' })
  amount: string;

  /**
   * Date the balance record was created
   *
   */
  @CreateDateColumn()
  createdAt?: Date;

  /**
   * Date the balance record was updated
   *
   */
  @UpdateDateColumn()
  updatedAt?: Date;
}
