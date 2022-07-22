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

  public async register(body: CreateUserDto): Promise<Users | never> {
    const { cpf, password } = body;
    const userExist = await this.userRepository.findOne({ where: { cpf } });

    if (userExist) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = {
      name: body.name,
      email: body.email,
      cpf,
      password: this.authHelper.encodePassword(password),
      birthdate: body.birthdate,
    };

    const userCreated = await this.userRepository.create(newUser);

    return this.userRepository.save(userCreated);
  }

  public async login(body: LoginDto): Promise<string | never> {
    const { cpf, password }: LoginDto = body;
    const user = await this.userRepository.findOne({ where: { cpf } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (!this.authHelper.validatePassword(password, user.password)) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return this.authHelper.generateToken(user);
  }

  public async refreshToken(user: Users): Promise<string> {
    return this.authHelper.generateToken(user);
  }
}
