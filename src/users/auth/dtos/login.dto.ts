import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  public readonly cpf: string;

  @IsString()
  @Length(6, 10)
  public readonly password: string;
}
