import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  agency: string;

  @Column()
  digit_agency_v: string;

  @Column()
  account_number: string;

  @Column()
  digit_acount_v: string;

  @Column()
  balance: number;

  @Column()
  password: string;
}
