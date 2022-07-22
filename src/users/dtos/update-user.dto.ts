import {
  IsEmail,
  IsString,
  Length,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(4, 40)
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsOptional()
  @IsString()
  @Length(6, 10)
  password: string;

  @IsOptional()
  @IsDateString()
  birthdate: Date;
}
