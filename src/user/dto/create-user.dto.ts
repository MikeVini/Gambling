import { IsEmail, IsPhoneNumber, IsUppercase, Length } from 'class-validator';

/**
 * CreateUserDto dto class
 */
export class CreateUserDto {
  /**
   * Email address
   *
   */
  @IsEmail()
  @Length(3, 70)
  email: string;

  /**
   * First name user
   *
   */
  @Length(3, 50)
  firstName?: string;

  /**
   * Last name user
   *
   */
  @Length(3, 50)
  lastName?: string;

  /**
   * Region client (e.g. DE, US, CH)
   */
  @IsUppercase()
  @Length(2, 2)
  region: string;

  /**
   * Phone number user
   *
   */
  @IsPhoneNumber(this.region)
  phone: string;
}
