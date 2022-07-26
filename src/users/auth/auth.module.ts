import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';
import { JwtStrategy } from './auth.strategy';
import { Users } from '../users.entity';
import { Accounts } from '../../accounts/account.entity';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES') },
      }),
    }),
    TypeOrmModule.forFeature([Users, Accounts]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, AccountsService],
})
export class AuthModule {}
