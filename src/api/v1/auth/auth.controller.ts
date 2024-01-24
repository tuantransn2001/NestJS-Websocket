import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { LoginDto as LoginDtoInput } from './dto/input/loginDto';

import { RegisterDto } from './dto/input/registerDto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(
    @Body() loginDto: LoginDtoInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(loginDto, response);
  }

  @Post('/register')
  public async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.register(registerDto, response);
  }

  @Post('/refresh')
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.refreshToken(request, response);
  }

  @Get('/me')
  public async getMe(@Req() request: Request) {
    return await this.authService.getMe(request);
  }
}
