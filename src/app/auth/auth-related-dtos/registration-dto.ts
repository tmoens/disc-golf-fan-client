import { IsEmail, IsString, Length } from "class-validator";

export class RegistrationDto {
  @Length(3, 50, { message: `Fan's name must be 1 to 50 characters long` })
  public name!: string;

  @IsEmail()
  public email!: string;

  @IsString()
  public password!: string;

  @IsString()
  public registrationCode!: string;
}
