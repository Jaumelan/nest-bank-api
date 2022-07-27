import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthHelper } from './auth.helper';
import { AccountsService } from 'src/accounts/accounts.service';
//import { CreateAccountDto } from 'src/accounts/dtos/create-account.dto';
import { Accounts } from '../../accounts/account.entity';

export interface RegisterRsp {
  token: string;
  account: Accounts;
}

@Injectable()
export class AuthService {
  @InjectRepository(Users)
  private readonly userRepository: Repository<Users>;

  @Inject(AccountsService) private readonly accountsService: AccountsService;

  @Inject(AuthHelper) private readonly authHelper: AuthHelper;

  public async register(body: CreateUserDto): Promise<RegisterRsp | never> {
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

    const user = await this.userRepository.save(userCreated);

    if (!user) {
      throw new HttpException('User not created', HttpStatus.CONFLICT);
    }

    const account = await this.accountsService.create(password, user);

    if (!account) {
      throw new HttpException('Account not created', HttpStatus.CONFLICT);
    }

    return {
      token: this.authHelper.generateToken(user),
      account,
    };
  }

  public async login(body: LoginDto): Promise<string | never> {
    const { cpf, password }: LoginDto = body;
    const user = await this.userRepository.findOne({ where: { cpf } });

    if (!user) {
      throw new NotFoundException('User not found');
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
