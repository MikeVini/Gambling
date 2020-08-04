import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './dto/transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { GetTransactionsDto } from './dto/get-transactions.dto';

/**
 * Transaction controller
 */
@Controller('/v1/transaction')
@UseGuards(AuthGuard)
@ApiHeader({
  name: 'HMAC-SHA512',
  description: 'Request signature',
})
@ApiHeader({
  name: 'DATE-TIME',
  description: 'Current date in milliseconds',
})
@ApiHeader({
  name: 'MERCHANT-ID',
  description: 'Merchant ID ',
})
export class TransactionController {
  /**
   * The "constructor"
   *
   * @param service
   */
  constructor(private service: TransactionService) {}

  /**
   * Create transaction query
   *
   * @param createTransactionDto
   */
  @Post('')
  @Roles('acquiring')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionDto> {
    return this.service.create(createTransactionDto);
  }

  /**
   * Get transaction query
   *
   * @param id
   * @param headers
   */
  @Get(':id')
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  getTransaction(
    @Param('id') id: string,
    @Headers() headers,
  ): Promise<TransactionDto> {
    return this.service.getTransaction(id, headers['merchant-id']);
  }

  /**
   * Get transactions query
   *
   * @param getTransactionsDto
   * @param headers
   */
  @Get()
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  getTransactions(
    @Query() getTransactionsDto: GetTransactionsDto,
    @Headers() headers,
  ): Promise<TransactionDto[]> {
    return this.service.getTransactions(
      getTransactionsDto,
      headers['merchant-id'],
    );
  }
}
