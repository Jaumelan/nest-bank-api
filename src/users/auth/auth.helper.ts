import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthHelper {
  @InjectRepository(Users)
  private readonly userRepository: Repository<Users>;

  constructor(private readonly jwt: JwtService) {}

  //Decoding the JWT token
  public async decode(token: string): Promise<any> {
    return this.jwt.decode(token, null);
  }

  //Get User by user ID from decode token
  public async validateUser(decoded: any): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: { id: decoded.id },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  //Generate JWT token
  public generateToken(user: Users): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      cpf: user.cpf,
      birthdate: user.birthdate,
    };
    return this.jwt.sign(payload);
  }

  //Validate user's password
  public validatePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  //Encode user's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  //Validate JWT token, if it's valid, return user's data
  public async validateToken(token: string): Promise<Users> {
    const decoded = this.jwt.decode(token, null);
    if (!decoded) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.validateUser(decoded);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
