import { IsEmail } from "class-validator";

export class UpdateUserDto {
  @IsEmail()
  public email!: string;
}
