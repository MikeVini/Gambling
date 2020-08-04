import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Method } from 'axios';
import * as _ from 'lodash';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersClients } from './entity/users-clients.entity';
import { ClientService } from '../client/client.service';
import { ExchangeService } from '../exchange/exchange.service';

/**
 * User service
 */
@Injectable()
export class UserService {
  /**
   * The "constructor"
   *
   * @param userRepository
   * @param usersClientsRepository
   * @param exchangeService
   * @param clientService
   */
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UsersClients)
    private readonly usersClientsRepository: Repository<UsersClients>,
    private readonly exchangeService: ExchangeService,
    private readonly clientService: ClientService,
  ) {}

  /**
   * Register user function
   *
   * @returns {Promise<UserDto>} deleted user
   *
   * @param createUserDto
   * @param clientId
   */
  async create(
    createUserDto: CreateUserDto,
    clientId: string,
  ): Promise<UserDto> {
    let exists = null;
    const userExists = await this.userRepository.findOne({
      phone: createUserDto.phone,
    });
    if (userExists) {
      exists = await this.usersClientsRepository.findOne({
        userId: userExists.id,
        clientId,
      });
    }

    if (exists) {
      throw new HttpException('User already exits', 500);
    }

    const method: Method = 'POST';
    const params = {
      url: '/registrationUser',
      method,
      data: {
        phone: createUserDto.phone,
        name: createUserDto.lastName,
        email: createUserDto.email,
        clientId,
        type: 'user',
      },
    };
    const response = await this.exchangeService.sendMessage(params);
    const sub = _.get(response, 'item.sub');

    if (!sub) {
      throw new HttpException(HttpStatus['500'], 500);
    }

    let user = _.assignIn(new User(), { identityId: sub }, createUserDto);

    const client = await this.clientService.get(clientId);
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (userExists) {
        user = _.assignIn(user, { id: userExists.id });
      }

      const userNew: User = await queryRunner.manager.save(user);
      if (!userNew) {
        return;
      }
      const usersClients = _.assignIn(new UsersClients(), {
        userId: userNew.id,
        clientId: client.id,
      });
      await queryRunner.manager.save(usersClients);
      await queryRunner.commitTransaction();

      return new UserDto(userNew);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get user function
   *
   * @returns {Promise<UserDto>} user with id
   * @param id
   * @param clientId
   */
  async get(id: string, clientId: string): Promise<UserDto> {
    const exists = await this.usersClientsRepository.findOne({
      userId: id,
      clientId,
    });

    if (exists) {
      return this.userRepository.findOne({
        select: ['email', 'firstName', 'phone'],
        where: [{ id }],
      });
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
