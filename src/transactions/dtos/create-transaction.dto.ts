import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class createTransactionDto {
  @IsNotEmpty()
  @Transform(({ obj }) => parseInt(obj.value))
  @IsPositive()
  @Max(5000)
  value: number;

  @IsString()
  type: string;

  @IsNotEmpty()
  @Transform(({ obj }) => parseInt(obj.origin_account_id))
  @IsNumber()
  origin_account_id: number;

  @IsNotEmpty()
  @Transform(({ obj }) => parseInt(obj.dest_account_id))
  @IsNumber()
  dest_account_id: number;
}
