import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AuthCredentialsDTO {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @IsString()
  userName: string;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, {
    message: 'Password should match 1 uppercase, 1 lowercase, 1 digit',
  })
  @IsString()
  password: string;
}
