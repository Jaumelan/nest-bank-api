import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export class TransferDto {
  @IsNotEmpty()
  @Transform(({ obj }) => parseInt(obj.value))
  @IsPositive()
  @IsNumber()
  value: number;

  @IsString()
  type: string;

  @IsNotEmpty()
  @Transform(({ obj }) => parseInt(obj.origin_account_id))
  @IsNumber()
  origin_account_id: number;

  @IsNotEmpty()
  @IsString()
  dest_account_number: string;

  @IsNotEmpty()
  @IsString()
  dest_agency: string;

  @IsNotEmpty()
  @IsString()
  dest_account_ver_code: string;

  @IsNotEmpty()
  @IsString()
  dest_agency_ver_code: string;

  @IsNotEmpty()
  @IsString()
  dest_cpf: string;
}
