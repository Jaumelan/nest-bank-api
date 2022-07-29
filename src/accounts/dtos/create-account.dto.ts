import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @Length(6, 10)
  @IsNotEmpty()
  password: string;
}
