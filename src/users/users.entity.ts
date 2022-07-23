import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Accounts } from '../accounts/account.entity';

@Entity({ name: 'users', schema: 'public' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  birthdate: Date;

  @Column()
  cpf: string;

  @OneToMany(() => Accounts, (account) => account.user_id)
  accounts: Accounts[];
}
