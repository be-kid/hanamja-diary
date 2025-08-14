import { IsString, MinLength, MaxLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  nickname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  password: string;
}
