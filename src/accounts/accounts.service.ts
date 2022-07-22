import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Accounts } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { CreateAccountData } from './../utils/createAccountData';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Injectable()
export class AccountsService {
  private createAccoundData = CreateAccountData;
  constructor(
    @InjectRepository(Accounts) private accountRepository: Repository<Accounts>,
  ) {}
  async create(createAccountDto: CreateAccountDto): Promise<Accounts> {
    const account = this.accountRepository.create(
      new this.createAccoundData(createAccountDto).generateData(),
    );
    account.password = '12345678';
    account.user_id = 1;
    return this.accountRepository.save(account);
  }
  async findAccount(id: number): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }
  async findAccounts(id: number): Promise<Accounts[]> {
    if (!id) {
      throw new NotFoundException('User id is required');
    }
    const accounts = await this.accountRepository.find({
      where: { user_id: id },
    });
    if (!accounts) {
      throw new NotFoundException("User doesn't have account");
    }
    return accounts;
  }
  async updateAccount(id: number, data: UpdateAccountDto): Promise<Accounts> {
    if (!id) {
      throw new NotFoundException('Account id is required');
    }
    const account = await this.findAccount(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    Object.assign(account, data);
    return this.accountRepository.save(account);
  }
}
