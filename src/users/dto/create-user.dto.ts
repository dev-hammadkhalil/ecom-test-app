import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @Length(3, 20)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(5, 50)
  email: string;

  //   @IsStrongPassword() can be used in real scenarios but in my case it is not needed for now as a test task
  @IsString()
  @Length(8, 20)
  @IsNotEmpty()
  password: string;
}
