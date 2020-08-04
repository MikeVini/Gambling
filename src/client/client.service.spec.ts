import { Test, TestingModule } from '@nestjs/testing';
import { getRepository, Repository } from 'typeorm';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/common';
import * as _ from 'lodash';
import { ClientService } from './client.service';
import { BalanceService } from '../balance/balance.service';
import { ExchangeService } from '../exchange/exchange.service';
import { Client } from './entity/client.entity';
import { Balance } from '../balance/entity/balance.entity';
import * as ormconfig from '../../ormconfig.json';

describe('ClientService', () => {
  let service: ClientService;
  let exchangeService: ExchangeService;
  let balanceService: BalanceService;
  let httpService: HttpService;
  let configService: ConfigService;

  let clientRepository: Repository<Client>;
  let balanceRepository: Repository<Balance>;

  const testConnectionName = 'testConnection';
  const config = _.assignIn(ormconfig, {
    name: testConnectionName,
    entities: [Client, Balance],
  });
  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeService,
        BalanceService,
        {
          provide: getRepositoryToken(Client),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Balance),
          useClass: Repository,
        },
      ],
      imports: [
        TypeOrmModule.forRoot(config),
        ConfigModule.forRoot({ envFilePath: './.env.test' }),
        HttpModule,
      ],
    }).compile();

    balanceRepository = getRepository(Balance, testConnectionName);
    clientRepository = getRepository(Client, testConnectionName);

    httpService = testingModule.get<HttpService>(HttpService);
    configService = testingModule.get<ConfigService>(ConfigService);

    exchangeService = new ExchangeService(httpService, configService);
    balanceService = new BalanceService(balanceRepository);

    service = new ClientService(
      clientRepository,
      exchangeService,
      balanceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
