import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepository, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientService } from '../client/client.service';
import { ExchangeService } from '../exchange/exchange.service';
import { UsersClients } from './entity/users-clients.entity';
import { Client } from '../client/entity/client.entity';
import { User } from './entity/user.entity';
import * as ormconfig from '../../ormconfig.json';
import { BalanceService } from '../balance/balance.service';
import { Balance } from '../balance/entity/balance.entity';

describe('UsersService', () => {
  let service: UserService;
  let exchangeService: ExchangeService;
  let clientService: ClientService;
  let balanceService: BalanceService;
  let httpService: HttpService;
  let configService: ConfigService;

  let userRepository: Repository<User>;
  let clientRepository: Repository<Client>;
  let usersClientsRepository: Repository<UsersClients>;
  let balanceRepository: Repository<Balance>;

  const testConnectionName = 'testConnection';
  const config = _.assignIn(ormconfig, {
    name: testConnectionName,
    entities: [User, Client, UsersClients, Balance],
  });
  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        ClientService,
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UsersClients),
          useClass: Repository,
        },
      ],
      imports: [
        TypeOrmModule.forRoot(config),
        ConfigModule.forRoot({ envFilePath: './.env.test' }),
        HttpModule,
      ],
    }).compile();

    userRepository = getRepository(User, testConnectionName);
    usersClientsRepository = getRepository(UsersClients, testConnectionName);
    clientRepository = getRepository(Client, testConnectionName);
    balanceRepository = getRepository(Balance, testConnectionName);

    configService = testingModule.get<ConfigService>(ConfigService);
    httpService = testingModule.get<HttpService>(HttpService);

    exchangeService = new ExchangeService(httpService, configService);
    balanceService = new BalanceService(balanceRepository);
    clientService = new ClientService(
      clientRepository,
      exchangeService,
      balanceService,
    );

    service = new UserService(
      userRepository,
      usersClientsRepository,
      exchangeService,
      clientService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
