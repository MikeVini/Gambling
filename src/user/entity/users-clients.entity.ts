import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * UsersClients entity class
 */
@Entity('users_clients')
export class UsersClients {
  /**
   * Unique ID
   */
  @PrimaryColumn('uuid')
  userId: string;

  /**
   * Client identityId in Cognito
   *
   */
  @PrimaryColumn('uuid')
  clientId: string;

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
