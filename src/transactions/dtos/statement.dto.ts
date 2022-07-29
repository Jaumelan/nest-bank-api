import { IsString, IsNotEmpty } from 'class-validator';

export class StatementDto {
  @IsNotEmpty()
  @IsString()
  agency: string;

  @IsNotEmpty()
  @IsString()
  digit_agency_v: string;

  @IsNotEmpty()
  @IsString()
  account_number: string;

  @IsNotEmpty()
  @IsString()
  digit_account_v: string;
}
