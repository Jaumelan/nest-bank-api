import { IsEmail, IsNotEmpty, IsString, Length, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(4, 40)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 10)
  password: string;

  @IsNotEmpty()
  @IsDate()
  birthDate: Date;
}
