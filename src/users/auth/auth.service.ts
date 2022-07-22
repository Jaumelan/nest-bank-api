import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
@InjectRepository(Users)
private readonly userRepository: Repository<Users>;

@Inject(AuthHelper) private readonly authHelper: AuthHelper;

public async register(createUserDto: CreateUserDto): Promise<Users | never> {
    const {cpf} 

}
