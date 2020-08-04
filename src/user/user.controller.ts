import {
  Controller,
  Post,
  Body,
  UseGuards,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../decorator/roles.decorator';

/**
 * User controller
 */
@Controller('/v1/user')
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
export class UserController {
  /**
   * The "constructor"
   *
   * @param service
   */
  constructor(private service: UserService) {}

  /**
   * Create user query
   *
   * @param createUserDto
   * @param headers
   */
  @Post('')
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers() headers,
  ): Promise<UserDto> {
    return this.service.create(createUserDto, headers['merchant-id']);
  }

  /**
   * Get user query
   *
   * @param id
   * @param headers
   */
  @Get(':id')
  @Roles('client')
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  get(@Param('id') id: string, @Headers() headers): Promise<UserDto> {
    return this.service.get(id, headers['merchant-id']);
  }
}
