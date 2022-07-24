import {
  Injectable,
  Inject,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Accounts } from '../accounts/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createTransactionDto } from './dtos/create-transaction.dto';
import { Transactions } from './transaction.entity';
import { Users } from '../users/users.entity';
import { AccountsService } from '../accounts/accounts.service';
import { StatementDto } from './dtos/statement.dto';
const fees = {
  deposit: 0.01,
  withdraw: 4,
  transfer: 1,
};

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transactions)
    private transactionRepository: Repository<Transactions>,
    @InjectRepository(Accounts) private accountRepository: Repository<Accounts>,
    @Inject(AccountsService) private accountsService: AccountsService,
  ) {}

  getFees(type: string): number {
    return fees[type];
  }

  async createDeposit(
    createData: createTransactionDto,
    user: Users,
  ): Promise<Transactions> {
    const { origin_account_id, dest_account_id, value } = createData;

    const originAccount = await this.accountRepository.findOne({
      where: { id: origin_account_id },
    });

    if (!originAccount) {
      throw new NotFoundException('Origin account not found');
    }

    if (originAccount.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const destAccount = await this.accountRepository.findOne({
      where: { id: dest_account_id },
    });

    if (!destAccount) {
      throw new NotFoundException('Destination account not found');
    }
    if (destAccount.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const data = {
      description: 'deposit',
      value,
      date: new Date(),
      origin_account_id,
      dest_account_id,
    };

    const bank = await this.accountsService.updateBankBalance(
      value * fees.deposit,
    );

    if (!bank) {
      throw new HttpException('Bank', HttpStatus.NOT_MODIFIED);
    }

    const accountUpdate = await this.accountsService.updateBalance(
      origin_account_id,
      value - value * fees.deposit,
      user,
    );

    if (!accountUpdate) {
      throw new HttpException('Account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const transactionData = this.transactionRepository.create(data);
    return this.transactionRepository.save(transactionData);
  }

  async createWithdraw(
    createData: createTransactionDto,
    user: Users,
  ): Promise<Transactions> {
    const { origin_account_id, dest_account_id, value } = createData;

    const originAccount = await this.accountRepository.findOne({
      where: { id: origin_account_id },
    });

    if (!originAccount) {
      throw new NotFoundException('Origin account not found');
    }

    if (originAccount.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (origin_account_id !== dest_account_id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (originAccount.balance < value + fees.withdraw) {
      throw new HttpException('Insufficient funds', HttpStatus.UNAUTHORIZED);
    }

    const data = {
      description: 'withdraw',
      value,
      date: new Date(),
      origin_account_id,
      dest_account_id,
    };

    const bank = await this.accountsService.updateBankBalance(fees.withdraw);

    if (!bank) {
      throw new HttpException('Bank', HttpStatus.NOT_MODIFIED);
    }

    const accountUpdate = await this.accountsService.updateBalance(
      origin_account_id,
      -value - fees.withdraw,
      user,
    );

    if (!accountUpdate) {
      throw new HttpException('Account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const transactionData = this.transactionRepository.create(data);
    return this.transactionRepository.save(transactionData);
  }

  async createTransfer(
    createData: createTransactionDto,
    user: Users,
  ): Promise<Transactions> {
    const { origin_account_id, dest_account_id, value } = createData;

    const originAccount = await this.accountRepository.findOne({
      where: { id: origin_account_id },
    });

    if (!originAccount) {
      throw new NotFoundException('Origin account not found');
    }

    if (originAccount.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const destAccount = await this.accountRepository.findOne({
      where: { id: dest_account_id },
    });

    if (!destAccount) {
      throw new NotFoundException('Destination account not found');
    }

    if (originAccount.balance < value + fees.transfer) {
      throw new HttpException('Insufficient funds', HttpStatus.UNAUTHORIZED);
    }

    const data = {
      description: 'transfer',
      value,
      date: new Date(),
      origin_account_id,
      dest_account_id,
    };

    const bank = await this.accountsService.updateBankBalance(fees.transfer);

    if (!bank) {
      throw new HttpException('Bank', HttpStatus.NOT_MODIFIED);
    }

    const accountOriginUpdate = await this.accountsService.updateBalance(
      origin_account_id,
      -value - fees.transfer,
      user,
    );

    if (!accountOriginUpdate) {
      throw new HttpException('Account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const accountDestUpdate = await this.accountsService.updateTransferBalance(
      dest_account_id,
      value,
    );

    if (!accountDestUpdate) {
      throw new HttpException('Account', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const transactionData = this.transactionRepository.create(data);
    return this.transactionRepository.save(transactionData);
  }

  async history(user: Users, statement: StatementDto) {
    const { id } = user;
    const { agency, account_number, digit_agency_v, digit_account_v } =
      statement;

    const originAccount = await this.accountRepository
      .createQueryBuilder()
      .select('*')
      .from(Accounts, 'account')
      .where('account.user_id = :id', { id })
      .andWhere('account.agency = :agency', { agency })
      .andWhere('account.account_number = :account_number', { account_number })
      .andWhere('account.digit_agency_v = :digit_agency_v', { digit_agency_v })
      .andWhere('account.digit_account_v = :digit_account_v', {
        digit_account_v,
      })
      .getRawOne();

    if (!originAccount) {
      throw new NotFoundException('Origin account not found');
    }

    const depositTransactions = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('dest_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'deposit',
      })
      .orderBy('date', 'DESC')
      .setParameter('dest_account_id', originAccount.id)
      .getRawMany();

    console.log(depositTransactions);
    const withdrawTransactions = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('dest_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'withdraw',
      })
      .orderBy('date', 'DESC')
      .setParameter('dest_account_id', originAccount.id)
      .getRawMany();

    console.log('saque ', withdrawTransactions);
    const transferTransactions = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('origin_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'transfer',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    const transactions = [
      ...depositTransactions,
      ...withdrawTransactions,
      ...transferTransactions,
    ];
    transactions
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .slice(0, 10);

    /* const transactionsWithBalance = transactions.map(transaction => {
      const { value, date } = transaction;
      const balance */

    return transactions;
  }
}
