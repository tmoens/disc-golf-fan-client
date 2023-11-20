import { IsEmail, Length } from 'class-validator';

export class AddFanDto {
  @Length(1, 50, { message: `Fan's username must be 1 to 50 characters long` })
  public username!: string;

  @Length(1, 50, { message: `Fan's name must be 1 to 50 characters long` })
  public name!: string;

  @IsEmail()
  public email!: string;
}
