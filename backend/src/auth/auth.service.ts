import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { nickname, password, gender } = signUpDto;

    const existingUser = await this.usersRepository.findOneBy({ nickname });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      nickname,
      password_hash,
      gender,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      // 데이터베이스 저장 중 발생할 수 있는 다른 오류 처리
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { nickname, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ nickname });

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      const payload = { nickname };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('로그인 정보를 확인해주세요.');
    }
  }

  async checkNickname(nickname: string): Promise<{ available: boolean }> {
    const user = await this.usersRepository.findOneBy({ nickname });
    console.log(user);
    return { available: !user };
  }
}
