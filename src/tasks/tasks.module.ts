import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Transaction } from '../transaction/entity/transaction.entity';
import { ExchangeModule } from '../exchange/exchange.module';
import { Client } from '../client/entity/client.entity';
import { User } from '../user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Client, User]),
    ExchangeModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
