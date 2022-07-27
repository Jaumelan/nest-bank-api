import {
  Controller,
  /*  Post,
  Body,
  Get,
  Patch,
  Param,
  NotFoundException,
  UseGuards,
  UseInterceptors, */
} from '@nestjs/common';
import { UsersService } from './users.service';
/* import { Users } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuardService } from './auth/auth.guard';
import { ClassSerializerInterceptor } from '@nestjs/common'; */

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /* @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.userService.create(createUserDto);
  }

  @Get('/:id')
  @UseGuards(AuthGuardService)
  async getUser(@Param('id') id: string): Promise<Users> {
    const user = this.userService.findUser(parseInt(id));

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get('/cpf/:cpf')
  @UseGuards(AuthGuardService)
  async getUserByCpf(@Param('cpf') cpf: string) {
    return this.userService.find(cpf);
  }

  @Patch('/:id')
  @UseGuards(AuthGuardService)
  async updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<Users> {
    return this.userService.update(parseFloat(id), data);
  } */
}
