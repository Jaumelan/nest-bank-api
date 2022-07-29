import {
  Controller,
  //Post,
  Body,
  Get,
  Patch,
  //Param,
  //NotFoundException,
  UseGuards,
  //UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './users.entity';
//import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuardService } from './auth/auth.guard';
//import { ClassSerializerInterceptor } from '@nestjs/common';
import { LogedUser } from 'src/decorators/loged-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  /* @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signup(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.userService.create(createUserDto);
  } */

  @Get('')
  @UseGuards(AuthGuardService)
  async getUser(@LogedUser() user: Users): Promise<Users> {
    return this.userService.findUser(user);
  }

  /*
  @Get('/cpf/:cpf')
  @UseGuards(AuthGuardService)
  async getUserByCpf(@Param('cpf') cpf: string) {
    return this.userService.find(cpf);
  } */

  @Patch('')
  @UseGuards(AuthGuardService)
  async updateUser(
    @LogedUser() user: Users,
    @Body() data: UpdateUserDto,
  ): Promise<Users> {
    return this.userService.update(user, data);
  }
}
