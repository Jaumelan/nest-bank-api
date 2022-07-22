import {
  Controller,
  Body,
  Inject,
  Post,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Users } from '../user.entity';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  private register(@Body() body: CreateUserDto): Promise<Users | never> {
    return this.authService.register(body);
  }

  @Post('login')
  private login(@Body() body: LoginDto): Promise<string | never> {
    return this.authService.login(body);
  }
}
