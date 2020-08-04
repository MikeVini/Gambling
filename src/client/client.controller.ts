import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientDto } from './dto/client.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorator/roles.decorator';
import { UpdateClientDto } from './dto/update-client.dto';

/**
 * Client controller
 */
@Controller('/v1/client')
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
export class ClientController {
  /**
   * The "constructor"
   *
   * @param service
   */
  constructor(private service: ClientService) {}

  /**
   * Create client query
   *
   * @param createClientDto
   */
  @Post()
  @Roles('admin')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(@Body() createClientDto: CreateClientDto): Promise<ClientDto> {
    return this.service.create(createClientDto);
  }

  /**
   * Update client query
   *
   * @param client
   * @param headers
   */
  @Put()
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  update(
    @Body() client: UpdateClientDto,
    @Headers() headers,
  ): Promise<ClientDto> {
    return this.service.update(headers['merchant-id'], client);
  }

  /**
   * Get client query
   *
   * @param headers
   */
  @Get()
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  get(@Headers() headers): Promise<ClientDto> {
    return this.service.get(headers['merchant-id']);
  }
}
