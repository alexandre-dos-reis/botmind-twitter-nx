import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignInDtoRequest,
  SignUpDtoRequest,
  SignInResponse,
  SignUpResponse,
} from '@botmind-twitter-nx/api-interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDtoRequest): Promise<SignUpResponse> {
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: SignInDtoRequest): Promise<SignInResponse> {
    return this.authService.signIn(dto);
  }
}
