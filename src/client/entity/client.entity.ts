import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEnum } from '../../enum/role.enum';
import { IsPhoneNumber } from 'class-validator';

/**
 * Client entity class
 */
@Entity('client')
export class Client {
  /**
   * Unique client ID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique client ID for encryption
   *
   */
  @Column({ length: 255, nullable: false, unique: true })
  identityId: string;

  /**
   * Secret key to generate HMAC-SHA-512
   *
   */
  @Column({ length: 255, nullable: false, unique: false })
  secret: string;

  /**
   * Email address
   *
   */
  @Column({ length: 70, nullable: false, unique: false })
  email: string;

  /**
   * Name client
   *
   */
  @Column({ length: 50, nullable: false })
  name: string;

  /**
   * Full name client
   *
   */
  @Column({ length: 50, nullable: true })
  fullName?: string;

  /**
   * Region client (e.g. DE, US, CH)
   */
  @Column({ length: 2, nullable: false })
  region: string;

  /**
   * Phone number client
   *
   */
  @Column({ length: 40, nullable: false })
  @IsPhoneNumber(this.region)
  phone: string;

  /**
   * Role client
   *
   */
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.CLIENT,
  })
  role: RoleEnum;

  /**
   * Date the client record was created
   *
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date the client record was updated
   *
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
