import {
  IsString,
  Length,
  IsNotEmpty,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 40)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 10)
  password: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;
}
