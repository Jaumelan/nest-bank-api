import { Trim } from 'class-sanitizer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @Trim()
  @IsNotEmpty()
  @IsEmail()
  public readonly email: string;

  @IsString()
  @Length(6, 10)
  public readonly password: string;
}
