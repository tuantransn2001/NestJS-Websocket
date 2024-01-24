import { Injectable } from '@nestjs/common';
import { User } from '../database/knex/models/user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { HttpException, RestFullAPI, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/input/registerDto';
import { LoginDto } from './dto/input/loginDto';
import { isEmpty } from '../common';
@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  public async issueToken(user: User, response: Response) {
    const payload = {
      sub: user.id,
      fullName: `${user.last_name} ${user.middle_name} ${user.first_name}`,
    };

    const accessToken = jwt.sign(
      { ...payload },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    const refreshToken = jwt.sign(
      { ...payload },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      },
    );
    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    return { accessToken, refreshToken };
  }
  public async login(loginDto: LoginDto, response: Response) {
    const foundUsers = await this.userService.getByPhoneOrEmail(
      loginDto.phone,
      undefined,
    );

    if (isEmpty(foundUsers))
      return handleErrorNotFound('Phone number do not exist!');

    const foundUser = foundUsers.find((u: User) => u.phone === loginDto.phone);

    const isMatchPassword = await bcrypt.compare(
      loginDto.password,
      foundUser.password,
    );

    if (!isMatchPassword)
      return RestFullAPI.onFail(STATUS_CODE.UNAUTHORIZED, {
        message: 'Password in-correct',
      } as HttpException);

    const loginResponse = RestFullAPI.onSuccess(
      STATUS_CODE.CREATED,
      'Successfully logged in',
      await this.issueToken(foundUser, response),
    );

    return loginResponse;
  }
  public async register(registerDTO: RegisterDto, response: Response) {
    const existUsers = await this.userService.getByPhoneOrEmail(
      registerDTO.phone,
      registerDTO.email,
    );

    if (!isEmpty(existUsers))
      return RestFullAPI.onFail(STATUS_CODE.BAD_REQUEST, {
        message: 'Phone || Email already in use !',
      } as HttpException);

    const createUserResult = await this.userService.insertOne(registerDTO);

    const registerResponse = RestFullAPI.onSuccess(
      STATUS_CODE.CREATED,
      STATUS_MESSAGE.SUCCESS,
      await this.issueToken(createUserResult, response),
    );

    return registerResponse;
  }
  public async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return RestFullAPI.onSuccess(
      STATUS_CODE.ACCEPTED,
      'Successfully logged out',
    );
  }
  public async refreshToken(req: Request, response: Response) {
    const refreshToken =
      req.cookies['refresh_token'] || req.body['refresh_token'];

    if (!refreshToken) {
      return RestFullAPI.onFail(STATUS_CODE.UNAUTHORIZED, {
        message: 'Refresh token not found',
      } as HttpException);
    }
    let payload;

    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return RestFullAPI.onFail(STATUS_CODE.UNAUTHORIZED, {
        message: 'Invalid or expired refresh token',
      } as HttpException);
    }
    const userExists = await this.userService.findUniq(payload.sub);

    if (!userExists) {
      return RestFullAPI.onFail(STATUS_CODE.BAD_REQUEST, {
        message: 'User no longer exists',
      } as HttpException);
    }

    const expiresIn = 15000;
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    const accessToken = jwt.sign(
      { ...payload, exp: expiration },
      process.env.ACCESS_TOKEN_SECRET,
    );
    response.cookie('access_token', accessToken, { httpOnly: true });
    const refreshTokenReponse = RestFullAPI.onSuccess(
      STATUS_CODE.CREATED,
      'Successfully logged in',
      { accessToken },
    );

    return refreshTokenReponse;
  }
  public async getMe(req: Request) {
    const access_token = req.cookies['access_token'];

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    const currentUserLogin = await this.userService.findUniq(
      (decoded.sub || '') as string,
    );

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      currentUserLogin.toDto(),
    );
  }
}
