import { Injectable } from '@nestjs/common';
import { User } from '../database/knex/models/user.model';
import { LoginDto } from '../auth/dto/input/loginDto';
import { RegisterDto } from '../auth/dto/input/registerDto';
import { v4 as uuidv4 } from 'uuid';
import { reduce as asyncReduce, each as asyncForEach } from 'awaity';
import { getCurrentTime, isEmpty } from '../common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { ModelName } from '../common/enums/common';
import * as bcrypt from 'bcrypt';
import { USER_STATUS, USER_TYPE } from './enum';
import { UpdateUserDto } from '../auth/dto/input/updateUserDto';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';
import { AddAvatarDto } from './shared/user.interface';
import { AddAvatarSchema } from './shared/user.schema';
import { CreateLocalFileDto } from '../local-file/shared/localFile.interface';
import { LocalFileService } from '../local-file/local-file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    private readonly localFileService: LocalFileService,
  ) {}

  public async findUniq(id: string): Promise<User | undefined> {
    const foundUser = await User.query()
      .findOne({ id, is_deleted: false })
      .first()
      .returning('*');
    return foundUser ? foundUser : undefined;
  }
  public async getByPhoneOrEmail(
    phone?: string,
    email?: string,
  ): Promise<User[] | undefined[]> {
    const condition = {
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
    };

    const foundUsers: User[] = await asyncReduce(
      Object.entries(condition),
      async (r: User[], [k, v]) => {
        const foundUser = await User.query()
          .findOne({ is_deleted: false, ...{ [k]: v } })
          .first();

        const isUserExist = (): boolean => foundUser !== undefined;
        const isSameUser = (): boolean =>
          r.findIndex((u: User) => u.id === foundUser.id) !== -1;

        if (isUserExist() && !isSameUser()) r.push(foundUser);

        return r;
      },
      [],
    );

    return foundUsers;
  }
  public async getCurrentLogin(loginDto: LoginDto): Promise<User | undefined> {
    const foundUser = await User.query()
      .findOne({ is_deleted: false, ...loginDto })
      .first();
    return foundUser;
  }
  public async insertOne(user: RegisterDto) {
    const SALT = 10;
    const hash = bcrypt.hashSync(user.password, SALT);

    const createdUser = await this.knex
      .table(ModelName.USER)
      .insert({
        id: uuidv4(),
        email: user.email,
        phone: user.phone,
        password: hash,
        first_name: user.first_name ? user.first_name : '',
        last_name: user.last_name ? user.last_name : '',
        middle_name: user.middle_name ? user.middle_name : '',
        type: user.type ? user.type : USER_TYPE.USER,
        status: user.status ? user.status : USER_STATUS.OFFLINE,
        search_name:
          user.last_name + ' ' + user.middle_name + ' ' + user.first_name,
        is_active: true,
        is_reported: false,
        is_blocked: false,
        createdAt: getCurrentTime(),
      })
      .returning('*');

    return createdUser[0];
  }
  public async searchListUser({
    ids,
  }: {
    ids: {
      [k: string]: string[];
    };
  }) {
    const base: any = Object.entries(USER_TYPE).reduce((res, [k]) => {
      res[k.toLocaleLowerCase()] = [];
      return res;
    }, {});

    const entry = Object.entries(ids);

    const source = entry
      .map(([type, ids]) => ids.map((id) => ({ type, id })))
      .flat(1);

    await asyncForEach(source, async ({ type, id }) => {
      const foundUser = await this.findUniq(id);

      if (foundUser) base[type].push(foundUser.toDto());
      else {
        base[type].push({ id });
      }
    });

    return base;
  }
  public async getOneUser(id: string) {
    const foundUser = await this.findUniq(id);
    if (!foundUser) return handleErrorNotFound('User do not exists');

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      foundUser.toDto(),
    );
  }
  public async searchUserByName(payload: {
    limit: number;
    offset: number;
    idsToSkip: number;
    name?: string;
  }) {
    if (isEmpty(payload.name))
      return {
        count: 0,
        items: [],
      };

    const foundUsers = await User.query()
      .where('first_name', 'like', `%${payload.name}%`)
      .andWhere('is_deleted', false)
      .offset(payload.offset)
      .limit(payload.limit);

    return {
      count: foundUsers?.length,
      items: foundUsers.map((u) => u.toDto()),
    };
  }
  public async addAvatar(payload: AddAvatarDto) {
    try {
      const { id, file } = AddAvatarSchema.parse(payload);

      const newFile: CreateLocalFileDto = {
        fileName: file.fileName,
        path: file.path,
        mimeType: file.mimeType,
      };

      const createdAvatar = (await this.localFileService.create(
        newFile,
      )) as any;

      const updatedUserAvatar = await this.knex(ModelName.USER)
        .update({ avatar: createdAvatar?.data.id, updatedAt: new Date() })
        .where({
          id,
        })
        .returning('*');

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        updatedUserAvatar,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
  public async updateProfile(payload: UpdateUserDto) {
    const foundUser = await this.findUniq(payload.id);
    if (!foundUser) return handleErrorNotFound('User do not exists');

    const updatedUser = await this.knex(ModelName.USER)
      .update({ ...payload, updatedAt: new Date() })
      .where({
        id: payload.id,
      })
      .returning('*');

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      updatedUser,
    );
  }
}
