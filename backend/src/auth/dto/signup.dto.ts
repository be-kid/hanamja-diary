import { IsString, MinLength, MaxLength, IsEnum } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';

export class SignUpDto extends AuthCredentialsDto {
  @IsEnum(['남자', '여자'], { message: '성별은 남자 또는 여자여야 합니다.' })
  gender: '남자' | '여자';
}
