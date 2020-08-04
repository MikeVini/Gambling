import {
  IsPhoneNumber,
  IsOptional,
  IsUppercase,
  Length,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

/**
 * UpdateClientDto dto class
 */
export class UpdateClientDto {
  /**
   * Unique client ID
   */
  @ApiHideProperty()
  @Exclude()
  id: string;

  /**
   * Unique client ID for encryption
   *
   */
  @ApiHideProperty()
  @Exclude()
  identityId: string;

  /**
   * Secret key to generate HMAC-SHA-512
   *
   */
  @IsOptional()
  @Length(10, 255)
  secret?: string;

  /**
   * Role client
   *
   */
  @Exclude()
  @ApiHideProperty()
  role: string;

  /**
   * Email address
   *
   */
  @Exclude()
  @ApiHideProperty()
  email: string;

  /**
   * Name client
   *
   */
  @IsOptional()
  @Length(3, 50)
  name?: string;

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
  @IsOptional()
  @IsUppercase()
  @Length(2, 2)
  region?: string;

  /**
   * Phone number client
   *
   */
  @IsOptional()
  @IsPhoneNumber(this.region)
  phone?: string;

  /**
   * The "constructor"
   *
   * @param partial
   */
  constructor(partial?: Partial<UpdateClientDto>) {
    Object.assign(this, partial);
  }
}
