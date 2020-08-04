import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  IsPhoneNumber,
  IsUppercase,
} from 'class-validator';

/**
 * CreateClientDto dto class
 */
export class CreateClientDto {
  /**
   * Secret key to generate HMAC-SHA-512
   *
   */
  @IsNotEmpty()
  @Length(10, 255)
  secret: string;

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
}
