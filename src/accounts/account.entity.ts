import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../users/users.entity';

@Entity({ name: 'accounts', schema: 'public' })
export class Accounts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  account_number: string;

  @Column()
  agency: string;

  @Column()
  digit_agency_v: string;

  @Column()
  digit_account_v: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @Column({ select: false })
  password: string;

  @Column()
  @ManyToOne(() => Users, (user) => user.accounts)
  user_id: number;
}
