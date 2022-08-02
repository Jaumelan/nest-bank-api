import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { Transactions } from './transaction.entity';
import { TransactionsService } from './transactions.service';
import { AuthGuardService } from '../users/auth/auth.guard';
import { LogedUser } from '../decorators/loged-user.decorator';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { Users } from '../users/users.entity';
import { StatementDto } from './dtos/statement.dto';
import { TransferDto } from './dtos/transfer.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Post('deposit')
  @UseGuards(AuthGuardService)
  async deposit(
    @Body() createData: createTransactionDto,
    @LogedUser() user: Users,
  ): Promise<Transactions> {
    //console.log(user);
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
    @Body() transferDto: TransferDto,
    @LogedUser() user: Users,
  ): Promise<Transactions> {
    return this.transactionsService.createTransfer(transferDto, user);
  }

  @Post('history')
  @UseGuards(AuthGuardService)
  async transactionHistory(
    @LogedUser() user: Users,
    @Body() statement: StatementDto,
  ) {
    return this.transactionsService.history(user, statement);
  }

  @Get('/:id')
  @UseGuards(AuthGuardService)
  async getTransaction(@Param('id') id: number, @LogedUser() user: Users) {
    return this.transactionsService.find(id, user);
  }
}
