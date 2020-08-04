import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ExchangeService } from './exchange.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('EXCHANGE_URL'),
        timeout: configService.get('AXIOS_TIMEOUT', 35000),
        maxRedirects: configService.get('AXIOS_MAX_REDIRECTS', 2),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
