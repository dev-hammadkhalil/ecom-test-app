import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @Length(5, 50)
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(8, 20)
  @IsNotEmpty()
  password: string;
}
