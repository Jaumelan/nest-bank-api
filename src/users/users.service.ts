import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Users> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findUser(user: Users): Promise<Users> {
    const userData = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }

  async find(cpf: string): Promise<Users[]> {
    if (!cpf) {
      throw new NotFoundException('CPF is required');
    }
    return this.userRepository.find({ where: { cpf } });
  }

  async update(user: Users, data: CreateUserDto) {
    const userData = await this.findUser(user);
    if (!userData) {
      throw new NotFoundException('User not found');
    }

    Object.assign(userData, data);
    return this.userRepository.save(user);
  }
}
