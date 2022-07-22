import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Accounts {
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
  digit_account_v: string;

  @Column()
  balance: number;

  @Column({ select: false })
  password: string;
}
