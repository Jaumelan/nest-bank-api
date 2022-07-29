import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './account.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { AuthHelper } from '../users/auth/auth.helper';
import { Users } from '../users/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts, Users]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
      }),
    }),
  ],
  providers: [AccountsService, AuthHelper],
  controllers: [AccountsController],
})
export class AccountsModule {}
