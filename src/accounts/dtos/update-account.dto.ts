import { IsString, Length, IsOptional, IsPositive } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  agency: string;

  @IsOptional()
  @IsString()
  digit_agency_v: string;

  @IsOptional()
  @IsString()
  account_number: string;

  @IsOptional()
  @IsString()
  digit_account_v: string;

  @IsOptional()
  @IsPositive()
  balance: number;

  @IsOptional()
  @IsString()
  @Length(6, 10)
  password: string;
}
