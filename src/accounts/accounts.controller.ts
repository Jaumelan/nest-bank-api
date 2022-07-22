import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Accounts } from './account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}

  @Post('create')
  async createAccount(
    @Body() createAccount: CreateAccountDto,
  ): Promise<Accounts> {
    return this.accountService.create(createAccount);
  }

  @Get('/:id')
  async getAccount(@Param('id') id: string): Promise<Accounts> {
    return this.accountService.findAccount(parseInt(id));
  }
  @Get('/user/:id')
  async getAccounts(@Param('id') id: string): Promise<Accounts[]> {
    return this.accountService.findAccounts(parseInt(id));
  }
  @Patch('/:id')
  async updateAccount(
    @Param('id') id: string,
    @Body() data: UpdateAccountDto,
  ): Promise<Accounts> {
    console.log(data);
    return this.accountService.updateAccount(parseInt(id), data);
  }
  @Delete('/:id')
  async deleteAccount(@Param('id') id: string): Promise<Accounts> {
    return this.accountService.deleteAccount(parseInt(id));
  }
}
