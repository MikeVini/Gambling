import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { BalanceModule } from './balance/balance.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { TransactionModule } from './transaction/transaction.module';
import { ExchangeModule } from './exchange/exchange.module';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * Environment
 */
const environment = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    TasksModule,
    UserModule,
    ClientModule,
    BalanceModule,
    TransactionModule,
    ExchangeModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})

/**
 * AppModule class
 */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('client', 'user');
  }
}
