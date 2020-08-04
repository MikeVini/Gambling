import {
  IsEmail,
  IsPhoneNumber,
  IsUppercase,
  Length,
  MaxLength,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

/**
 * UserDto dto class
 */
export class UserDto {
  /**
   * Unique client ID
   */
  @MaxLength(36)
  id: string;

  /**
   * Unique client ID for encryption
   *
   */
  @ApiHideProperty()
  @Exclude()
  identityId: string;

  /**
   * Email address
   *
   */
  @IsEmail()
  @Length(3, 70)
  email: string;

  /**
   * Name address
   *
   */
  @Length(3, 50)
  firstName?: string;

  /**
   * Full name client
   *
   */
  @Length(3, 50)
  lastName?: string;

  /**
   * Region client (e.g. DE, US, CH)
   */
  @IsUppercase()
  @Length(2, 2)
  region?: string;

  /**
   * Phone number user
   *
   */
  @IsPhoneNumber(this.region)
  phone?: string;

  /**
   * The "constructor"
   *
   * @param partial
   */
  constructor(partial?: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
