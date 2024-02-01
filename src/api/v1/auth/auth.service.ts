import { Inject, Injectable } from '@nestjs/common';
import { User } from '../database/knex/models/user.model';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { HttpException, RestFullAPI, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api.enum';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/input/registerDto';
import { LoginDto } from './dto/input/loginDto';
import { isEmpty } from '../common';
import { IUserRepository } from '../user/repository/iuser.repository';
import { IUser } from '../user/shared/user.interface';
@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  public async getCurrentLogin(loginDto: LoginDto): Promise<User | undefined> {
    const foundUser = await User.query()
      .findOne({ is_deleted: false, ...loginDto })
      .first();
    return foundUser;
  }

  public issueToken(user: IUser, response: Response) {
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
    const foundUser = await this.userRepository.findByPhone(loginDto.phone);

    if (isEmpty(foundUser))
      return handleErrorNotFound('Phone number do not exist!');

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
      this.issueToken(foundUser, response),
    );

    return loginResponse;
  }
  public async register(registerDTO: RegisterDto, response: Response) {
    const existUsers = await this.userRepository.findByPhoneOrEmail(
      registerDTO.phone,
      registerDTO.email,
    );

    if (!isEmpty(existUsers))
      return RestFullAPI.onFail(STATUS_CODE.BAD_REQUEST, {
        message: 'Phone || Email already in use !',
      } as HttpException);

    const createUserResult = await this.userRepository.createOne(registerDTO);

    const registerResponse = RestFullAPI.onSuccess(
      STATUS_CODE.CREATED,
      STATUS_MESSAGE.SUCCESS,
      this.issueToken(createUserResult[0], response),
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
    const userExists = await this.userRepository.findUniq(payload.sub);

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
    const refreshTokenResponse = RestFullAPI.onSuccess(
      STATUS_CODE.CREATED,
      'Successfully logged in',
      { accessToken },
    );

    return refreshTokenResponse;
  }
  public async getMe(req: Request) {
    const access_token = req.cookies['access_token'];

    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET);

    const currentUserLogin = await this.userRepository.findUniq(
      (decoded.sub || '') as string,
    );

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      currentUserLogin,
    );
  }
}
