import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * User entity class
 */
@Entity('user')
export class User {
  /**
   * Unique user ID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Unique user ID for Cognito "uuid"
   *
   */
  @Column({ length: 255, nullable: false, unique: true })
  identityId: string;

  /**
   * Email address user
   *
   */
  @Column({ length: 70, nullable: false, unique: false })
  email: string;

  /**
   * First name user
   *
   */
  @Column({ length: 50, nullable: true })
  firstName?: string;

  /**
   * Last name user
   *
   */
  @Column({ length: 50, nullable: true })
  lastName?: string;

  /**
   * Phone number user
   *
   */
  @Column({ length: 20, nullable: true, unique: true })
  phone?: string;

  /**
   * Date the user record was created
   *
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Date the user record was updated
   *
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
