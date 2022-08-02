import {
  Controller,
  //Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Accounts } from './account.entity';
import { LogedUser } from '../decorators/loged-user.decorator';
//import { CreateAccountDto } from './dtos/create-account.dto';
import { AuthGuardService } from '../users/auth/auth.guard';
import { AccountsService } from './accounts.service';
import { UpdateAccountDto } from './dtos/update-account.dto';
import { Users } from '../users/users.entity';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}

  /* @Post('create')
  @UseGuards(AuthGuardService)
  async createAccount(
    @Body() createAccount: CreateAccountDto,
    @LogedUser() user: Users,
  ): Promise<Accounts> {
    return this.accountService.create(createAccount, user);
  } */

  @Get('/user/')
  @UseGuards(AuthGuardService)
  async getAccounts(@LogedUser() user: Users): Promise<Accounts[]> {
    return this.accountService.findAccounts(user.id);
  }

  @Get('/:id')
  @UseGuards(AuthGuardService)
  async getAccount(
    @Param('id') id: string,
    @LogedUser() user: Users,
  ): Promise<Accounts> {
    return this.accountService.findAccount(parseInt(id), user);
  }

  @Get('/user/:agency/:account/:ver_agency/:ver_account')
  @UseGuards(AuthGuardService)
  async getAccountId(
    @Param('agency') agency: string,
    @Param('account') account: string,
    @Param('ver_agency') ver_agency: string,
    @Param('ver_account') ver_account: string,
  ): Promise<number> {
    //console.log(agency, account, ver_agency, ver_account);
    return this.accountService.findAccountId(
      agency,
      account,
      ver_agency,
      ver_account,
    );
  }

  @Patch('/:id')
  @UseGuards(AuthGuardService)
  async updateAccount(
    @Param('id') id: string,
    @Body() data: UpdateAccountDto,
    @LogedUser() user: Users,
  ): Promise<Accounts> {
    //console.log(data);
    return this.accountService.updateAccount(parseInt(id), data, user);
  }
}
