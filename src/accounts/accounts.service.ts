import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Accounts } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
//import { CreateAccountDto } from './dtos/create-account.dto';
import { CreateAccountData } from './../utils/createAccountData';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Users } from '../users/users.entity';
import { AuthHelper } from '../users/auth/auth.helper';
const bankId = 2;

@Injectable()
export class AccountsService {
  private createAccoundData = CreateAccountData;
  constructor(
    @InjectRepository(Accounts) private accountRepository: Repository<Accounts>,
    @Inject(AuthHelper) private authHelper: AuthHelper,
  ) {}

  async create(password: string, user: Users): Promise<Accounts> {
    const account = this.accountRepository.create(
      new this.createAccoundData().generateData(),
    );
    account.password = this.authHelper.encodePassword(password);

    account.user_id = user.id;
    const newAccount = await this.accountRepository.create(account);

    const createdAccount = await this.accountRepository.save(newAccount);

    return this.findAccount(createdAccount.id, user);
  }

  async findAccount(id: number, user: Users): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.user_id !== user.id) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findAccountId(
    agency: string,
    account: string,
    ver_account: string,
    ver_agency: string,
  ): Promise<number> {
    const accountdata = await this.accountRepository
      .createQueryBuilder()
      .select('*')
      .from(Accounts, 'account')
      .where('account.agency = :agency', { agency })
      .andWhere('account.account_number = :account', { account })
      //.andWhere('account.digit_agency_v = :ver_agency', { ver_agency })
      //.andWhere('account.digit_account_v = :ver_account', { ver_account })
      .getRawOne();

    if (!accountdata) {
      throw new NotFoundException('Account not found');
    }
    return accountdata.id;
  }

  async findAccounts(id: number): Promise<Accounts[]> {
    const accounts = await this.accountRepository.find({
      where: { user_id: id },
    });

    if (!accounts) {
      throw new NotFoundException('Account not found');
    }
    return accounts;
  }

  async updateAccount(
    id: number,
    data: UpdateAccountDto,
    user: Users,
  ): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.findAccount(id, user);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    Object.assign(account, data);
    return this.accountRepository.save(account);
  }

  async updateBalance(
    id: number,
    value: number,
    user: Users,
  ): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.findAccount(id, user);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    if (account.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    account.balance = Number(account.balance) + value;
    return this.accountRepository.save(account);
  }

  async updateTransferBalance(id: number, value: number): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    account.balance = Number(account.balance) + value;
    return this.accountRepository.save(account);
  }

  async updateBankBalance(value: number): Promise<Accounts> {
    const account = await this.accountRepository.findOne({
      where: { id: bankId },
    });

    if (!account) {
      throw new NotFoundException('Bank account not found');
    }

    account.balance = Number(account.balance) + value;
    return this.accountRepository.save(account);
  }
}
