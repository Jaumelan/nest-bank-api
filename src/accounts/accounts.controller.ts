import { Controller, Post, Body } from '@nestjs/common';
import { Account } from './account.entity';
import { CreateAccountDto } from './dtos/create-account';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}
  @Post('create')
  async createAccount(
    @Body() createAccount: CreateAccountDto,
  ): Promise<Account> {
    return this.accountService.create(createAccount);
  }
}
