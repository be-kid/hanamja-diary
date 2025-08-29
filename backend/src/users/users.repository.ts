import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignUpDto } from '../auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { nickname, password, gender } = signUpDto;

    const existingUser = await this.repository.findOneBy({ nickname });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }

    const salt = await bcrypt.genSalt();
    const password_hash = await bcrypt.hash(password, salt);

    const user = this.repository.create({
      nickname,
      password_hash,
      gender,
    });

    await this.repository.save(user);
    return user;
  }

  async findOneByNickname(nickname: string): Promise<User | null> {
    return this.repository.findOneBy({ nickname });
  }
}