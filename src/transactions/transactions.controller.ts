import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { Transactions } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { AuthGuardService } from '../users/auth/auth.guard';
import { LogedUser } from '../decorators/loged-user.decorator';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { Users } from '../users/users.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('deposit')
  @UseGuards(AuthGuardService)
  async deposit(
    @Body() createData: createTransactionDto,
    @LogedUser() user: Users,
  ): Promise<Transactions> {
    return this.transactionsService.createDeposit(createData, user);
  }

  @Post('withdraw')
  @UseGuards(AuthGuardService)
  async withdraw(
    @Body() createData: createTransactionDto,
    @LogedUser() user: Users,
  ): Promise<Transactions> {
    return this.transactionsService.createWithdraw(createData, user);
  }

  @Post('transfer')
  @UseGuards(AuthGuardService)
  async transfer(
    @Body() createData: createTransactionDto,
    @LogedUser() user: Users,
  ): Promise<Transactions> {
    return this.transactionsService.createTransfer(createData, user);
  }
}
