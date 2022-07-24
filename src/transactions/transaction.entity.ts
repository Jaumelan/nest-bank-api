import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transactions', schema: 'public' })
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column()
  date: Date;

  @Column()
  origin_account_id: number;

  @Column()
  dest_account_id: number;
}
