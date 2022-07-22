import { Injectable, NotFoundException } from '@nestjs/common';
import { Users } from './user.entity';
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

  async findUser(id: number): Promise<Users> {
    if (!id) {
      throw new NotFoundException('User Id is required');
    }
    return this.userRepository.findOne({ where: { id } });
  }

  async find(cpf: string): Promise<Users[]> {
    if (!cpf) {
      throw new NotFoundException('CPF is required');
    }
    return this.userRepository.find({ where: { cpf } });
  }

  async update(id: number, data: CreateUserDto) {
    if (!id) {
      throw new NotFoundException('User Id is required');
    }
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);
    return this.userRepository.save(user);
  }
}
