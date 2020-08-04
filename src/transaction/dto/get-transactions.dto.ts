import { IsIn, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * GetTransactionsDto dto class
 */
export class GetTransactionsDto {
  /**
   * Transactions limit in the request selection
   */
  @Max(100)
  @Min(1)
  @IsNotEmpty()
  @Type(() => Number)
  limit: number;

  /**
   * How much to skip in the query selection
   *
   */
  @IsNotEmpty()
  @Type(() => Number)
  skip: number;

  /**
   * To sort by a field
   *
   */
  @IsNotEmpty()
  sortBy: string;

  /**
   * Sort direction
   *
   */
  @IsNotEmpty()
  @IsIn(['DESC', 'ASK'])
  sortDirection: string;
}
