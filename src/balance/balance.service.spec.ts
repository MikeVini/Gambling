import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, getConnection, getRepository } from 'typeorm';
import * as _ from 'lodash';
import { BalanceService } from './balance.service';
import { Balance } from './entity/balance.entity';
import * as ormconfig from '../../ormconfig.json';

describe('BalanceService', () => {
  let service: BalanceService;
  let repository: Repository<Balance>;

  const testConnectionName = 'testConnection';
  const config = _.assignIn(ormconfig, {
    name: testConnectionName,
    entities: [Balance],
  });
  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        BalanceService,
        {
          provide: getRepositoryToken(Balance),
          useClass: Repository,
        },
      ],
      imports: [TypeOrmModule.forRoot(config)],
    }).compile();

    repository = getRepository(Balance, testConnectionName);
    service = new BalanceService(repository);
  });

  afterEach(async () => {
    await getConnection(testConnectionName).close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return balance info for get', async () => {
    const balance = await service.create(
      '0845318c-9968-45ba-a419-b4f82b46a8dc',
      'NRON',
    );
    expect(await service.get(balance.id)).toEqual(balance);
  });
});
