import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transaction.entity';
import { Users } from '../users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Accounts } from '../accounts/account.entity';
import { ConfigService } from '@nestjs/config';
import { AuthHelper } from 'src/users/auth/auth.helper';
import { TransactionsService } from './transactions.service';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Users, Transactions]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
      }),
    }),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, AuthHelper, AccountsService],
})
export class TransactionsModule {}
