import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { Client } from '../client/entity/client.entity';
import { ClientModule } from '../client/client.module';
import { UsersClients } from './entity/users-clients.entity';
import { ExchangeModule } from '../exchange/exchange.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Client, UsersClients]),
    ExchangeModule,
    ClientModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
