import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsUppercase,
  Length,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../enum/role.enum';

/**
 * ClientDto dto class
 */
export class ClientDto {
  /**
   * Unique client ID
   */
  @Length(36, 255)
  id: string;

  /**
   * Unique client ID for encryption
   *
   */
  @ApiHideProperty()
  @Exclude()
  @Length(36, 255)
  identityId: string;

  /**
   * Secret key to generate HMAC-SHA-512
   *
   */
  @IsOptional()
  @Length(10, 255)
  secret: string;

  /**
   * Role client
   *
   */
  @Exclude()
  @ApiHideProperty()
  @IsNotEmpty()
  role: RoleEnum;

  /**
   * Email address
   *
   */
  @IsEmail()
  @Length(3, 70)
  email: string;

  /**
   * Name client
   *
   */
  @Length(3, 50)
  name: string;

  /**
   * Full name client
   *
   */
  @IsOptional()
  @Length(3, 50)
  fullName?: string;

  /**
   * Region client (e.g. DE, US, CH)
   */
  @IsUppercase()
  @Length(2, 2)
  region: string;

  /**
   * Phone number client
   *
   */
  @IsPhoneNumber(this.region)
  phone: string;

  /**
   * The "constructor"
   *
   * @param partial
   */
  constructor(partial?: Partial<ClientDto>) {
    Object.assign(this, partial);
  }
}
