import { IsEmail, Length } from "class-validator";

export class UpdateUserDto {
  @Length(1, 50, { message: `Fan's name must be 1 to 50 characters long` })
  public name!: string;

  @IsEmail()
  public email!: string;
}
