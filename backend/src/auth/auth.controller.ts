import { Controller, Post, Body, ValidationPipe, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<void> {
    await this.authService.signUp(signUpDto);
  }

  @Post('/login')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Get('/check-nickname/:nickname')
  async checkNickname(@Param('nickname') nickname: string): Promise<{ available: boolean }> {
    return this.authService.checkNickname(nickname);
  }
}
