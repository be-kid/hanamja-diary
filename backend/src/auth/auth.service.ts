import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/signup.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    try {
      await this.usersRepository.createUser(signUpDto);
    } catch (error) {
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { nickname, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneByNickname(nickname);

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const payload = { nickname };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 정보를 확인해주세요.');
    }
  }

  async checkNickname(nickname: string): Promise<{ available: boolean }> {
    const user = await this.usersRepository.findOneByNickname(nickname);
    return { available: !user };
  }
}