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
  user: Users;
  account: Accounts;
}

export interface LoginRsp {
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
      if (!this.authHelper.validatePassword(password, userExist.password)) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      const account = await this.accountsService.create(password, userExist);

      if (!account) {
        throw new HttpException('Account not created', HttpStatus.CONFLICT);
      }

      return {
        user: userExist,
        account,
      };
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
      user,
      account,
    };
  }

  public async login(body: LoginDto): Promise<LoginRsp | never> {
    const { cpf, password }: LoginDto = body;
    const user = await this.userRepository.findOne({ where: { cpf } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!this.authHelper.validatePassword(password, user.password)) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const account = await this.accountsService.findAccounts(user.id);

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
    }

    return {
      token: this.authHelper.generateToken(user),
      account: account[0],
    };
  }

  public async refreshToken(user: Users): Promise<string> {
    return this.authHelper.generateToken(user);
  }
}
