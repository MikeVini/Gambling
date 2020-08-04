import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { TransactionController } from './transaction.controller';
import { UsersClients } from '../user/entity/users-clients.entity';
import { Client } from '../client/entity/client.entity';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, UsersClients, Client])],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
