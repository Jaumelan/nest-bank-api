import { IsString, Length, IsNotEmpty, IsEmail, IsDate } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 10)
  password: string;

  @IsNotEmpty()
  @IsDate()
  birthdate: Date;
}
