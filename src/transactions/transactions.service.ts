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
import { TransferDto } from './dtos/transfer.dto';
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
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @Inject(AccountsService) private accountsService: AccountsService,
  ) {}

  getFees(type: string): number {
    return fees[type];
  }

  async find(id: number, user: Users) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const accountSent = await this.accountRepository.findOne({
      where: { id: transaction.origin_account_id },
    });

    const userSent = await this.userRepository.findOne({
      where: { id: accountSent.user_id },
    });

    const accountReceived = await this.accountRepository.findOne({
      where: { id: transaction.dest_account_id },
    });

    const userReceived = await this.userRepository.findOne({
      where: { id: accountReceived.user_id },
    });

    if (accountSent.user_id == user.id) {
      const data = {
        id: transaction.id,
        description: transaction.description + ' sent',
        value: transaction.value,
        date: transaction.date,
        user_origin: userSent.name,
        origin_account_id: transaction.origin_account_id,
        dest_account: accountReceived,
        user_dest: userReceived.name,
      };
      return data;
    } else if (accountReceived.user_id == user.id) {
      const data = {
        id: transaction.id,
        description: transaction.description + ' received',
        value: transaction.value,
        date: transaction.date,
        user_origin: userSent.name,
        origin_account: accountSent,
        dest_account_id: transaction.dest_account_id,
        user_dest: userReceived.name,
      };
      return data;
    } else {
      const data = {
        id: transaction.id,
        description: transaction.description,
        value: transaction.value,
        date: transaction.date,
        origin_account: accountSent,
        dest_account: accountReceived,
        user_origin: userSent.name,
        user_dest: userReceived.name,
      };
      return data;
    }
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

    const bankDepositdata = {
      description: 'deposit fee',
      value: fees.deposit,
      date: new Date(),
      origin_account_id: origin_account_id,
      dest_account_id: 2,
    };

    const bankDeposit = await this.transactionRepository.save(bankDepositdata);

    if (!bankDeposit) {
      throw new HttpException('Bank fee', HttpStatus.NOT_MODIFIED);
    }

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

    const bankTransferdata = {
      description: 'withdraw fee',
      value: fees.withdraw,
      date: new Date(),
      origin_account_id: origin_account_id,
      dest_account_id: 2,
    };

    const bankTransfer = await this.transactionRepository.save(
      bankTransferdata,
    );

    if (!bankTransfer) {
      throw new HttpException('Bank fee', HttpStatus.NOT_MODIFIED);
    }

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
    transferDto: TransferDto,
    user: Users,
  ): Promise<Transactions> {
    const { origin_account_id, value, dest_account_number, dest_agency } =
      transferDto;

    const originAccount = await this.accountRepository.findOne({
      where: { id: origin_account_id },
    });

    if (!originAccount) {
      throw new NotFoundException('Origin account not found');
    }

    if (originAccount.user_id !== user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const destAccounts = await this.accountRepository.find({
      where: { account_number: dest_account_number },
    });

    const destAccount = destAccounts.find((account) => {
      if (account.agency === dest_agency) {
        return account;
      }
    });

    if (!destAccount) {
      throw new NotFoundException('Destination account not found');
    }

    /* const destUser = await this.userRepository.findOne({
      where: { id: destAccount.user_id },
    }); */

    if (originAccount.balance < value + fees.transfer) {
      throw new HttpException('Insufficient funds', HttpStatus.UNAUTHORIZED);
    }

    const data = {
      description: 'transfer',
      value,
      date: new Date(),
      origin_account_id,
      dest_account_id: destAccount.id,
    };

    const bankTransferdata = {
      description: 'transfer fee',
      value: fees.transfer,
      date: new Date(),
      origin_account_id: origin_account_id,
      dest_account_id: 2,
    };

    const bankTransfer = await this.transactionRepository.save(
      bankTransferdata,
    );

    if (!bankTransfer) {
      throw new HttpException('Bank fee', HttpStatus.NOT_MODIFIED);
    }

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
      destAccount.id,
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

    const transferTransactionsSent = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('origin_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'transfer',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    transferTransactionsSent.forEach((transaction) => {
      transaction.description = 'transfer sent';
    });

    const transferTransactionsReceived = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('dest_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'transfer',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    transferTransactionsReceived.forEach((transaction) => {
      transaction.description = 'transfer received';
    });

    const bankTransferFees = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('origin_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'transfer fee',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    const bankDepositFees = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('origin_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'deposit fee',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    const bankWithdrawFees = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('origin_account_id = :id', { id: originAccount.id })
      .andWhere('description = :description', {
        description: 'withdraw fee',
      })
      .orderBy('date', 'DESC')
      .getRawMany();

    const transactions = [
      ...depositTransactions,
      ...withdrawTransactions,
      ...transferTransactionsSent,
      ...transferTransactionsReceived,
      ...bankTransferFees,
      ...bankDepositFees,
      ...bankWithdrawFees,
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
