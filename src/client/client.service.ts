import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Method } from 'axios';
import * as _ from 'lodash';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientDto } from './dto/client.dto';
import { Client } from './entity/client.entity';
import { BalanceService } from '../balance/balance.service';
import { ExchangeService } from '../exchange/exchange.service';

/**
 * Client service
 */
@Injectable()
export class ClientService {
  /**
   * The "constructor"
   *
   * @param clientRepository
   * @param exchangeService
   * @param balanceService
   */
  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly exchangeService: ExchangeService,
    private readonly balanceService: BalanceService,
  ) {}

  /**
   * Create new client
   *
   * @returns {Promise<Client>} created client
   * @param createClientDto
   */
  async create(createClientDto: CreateClientDto): Promise<ClientDto> {
    const client = await this.clientRepository.findOne({
      phone: createClientDto.phone,
    });

    if (client) {
      throw new HttpException('Client already exits', 500);
    }
    const method: Method = 'POST';
    const params = {
      url: '/registrationUser',
      method,
      data: {
        phone: createClientDto.phone,
        name: createClientDto.name,
        email: createClientDto.email,
        type: 'client',
      },
    };

    const response = await this.exchangeService.sendMessage(params);
    const sub = _.get(response, 'item.sub');

    if (!sub) {
      throw new HttpException(HttpStatus['500'], 500);
    }

    const newClient = _.assignIn(createClientDto, {
      identityId: sub,
    });

    return new ClientDto(await this.clientRepository.save(newClient));
  }

  /**
   * Get client
   *
   * @returns {Promise<ClientDto>} client with id
   * @param id
   */
  async get(id: string): Promise<ClientDto> {
    return new ClientDto(await this.clientRepository.findOne(id));
  }

  /**
   * Update client
   *
   * @returns {Promise<ClientDto>} result update
   * @param id client
   * @param client object UpdateClientDto
   */
  async update(id: string, client: UpdateClientDto): Promise<ClientDto> {
    await this.clientRepository.update(id, client);

    return new ClientDto(await this.clientRepository.findOne(id));
  }

  /**
   * Delete client function
   *
   * @ignore
   *
   * @returns {Promise<boolean>} deleted client
   * @param id
   */
  protected async delete(id: string): Promise<DeleteResult> {
    return this.clientRepository.delete(id);
  }
}
