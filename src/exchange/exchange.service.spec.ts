import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeService } from './exchange.service';
import { HttpModule, HttpService } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Method } from 'axios';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [ExchangeService, ConfigService],
      imports: [
        ConfigModule.forRoot({ envFilePath: './.env.test' }),
        HttpModule,
      ],
    }).compile();
    configService = testingModule.get<ConfigService>(ConfigService);
    httpService = testingModule.get<HttpService>(HttpService);
    service = new ExchangeService(httpService, configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return getHmac', async () => {
    const result =
      '9ba1f63365a6caf66e46348f43cdef956015bea997adeb06e69007ee3ff517df10fc5eb860da3d43b82c2a040c931119d2dfc6d08e253742293a868cc2d82015';
    expect(await service.getHmac('test', 'sha512', 'test')).toBe(result);
  });

  it("should return throw('Client already exists') for sendMessage", async () => {
    const result = 'Client already exists';
    const method: Method = 'POST';
    const params = {
      baseURL: configService.get('EXCHANGE_URL'),
      url: '/registrationUser',
      method,
      data: {
        phone: '+79234046340',
        name: 'Test',
        email: 'Test',
        type: 'client',
      },
    };

    await expect(service.sendMessage(params)).rejects.toThrow();
  });
});
