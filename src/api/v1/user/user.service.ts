import { Inject, Injectable } from '@nestjs/common';
import { each as asyncForEach } from 'awaity';
import { USER_TYPE } from './enum';
import { UpdateUserDto } from '../auth/dto/input/updateUserDto';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api.enum';
import { AddAvatarDto } from './shared/user.interface';
import { IUserRepository } from './repository/iuser.repository';
import { ILocalFileRepository } from '../local-file/repository/ilocalfile.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('LocalFileRepository')
    private readonly localFileRepository: ILocalFileRepository,
  ) {}

  // todo: refactor this method
  public async searchListUser({
    ids,
  }: {
    ids: {
      [k: string]: string[];
    };
  }) {
    const base = Object.entries(USER_TYPE).reduce((res, [k]) => {
      res[k.toLocaleLowerCase()] = [];
      return res;
    }, {});

    const entry = Object.entries(ids);

    const source = entry
      .map(([type, ids]) => ids.map((id) => ({ type, id })))
      .flat(1);

    await asyncForEach(source, async ({ type, id }) => {
      const foundUser = await this.userRepository.findUniq(id);

      if (foundUser) base[type].push(foundUser);
      else base[type].push({ id });
    });

    return base;
  }

  public async getOneUser(id: string) {
    const foundUser = await this.userRepository.findUniq(id);
    if (!foundUser) return handleErrorNotFound('User do not exists');

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      foundUser,
    );
  }

  public async addAvatar(payload: AddAvatarDto) {
    try {
      const { id, file } = payload;

      const createdAvatar = await this.localFileRepository.create(file);

      const updatedUserAvatar = await this.userRepository.updateOne(id, {
        avatar: createdAvatar.id,
      });

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
    const foundUser = await this.userRepository.findUniq(payload.id);
    if (!foundUser) return handleErrorNotFound('User do not exists');

    await this.userRepository.updateOne(payload.id, payload);

    return RestFullAPI.onSuccess(STATUS_CODE.OK, STATUS_MESSAGE.SUCCESS);
  }

  public async searchUserByName({
    idsToSkip,
    limit,
    offset,
    name,
  }: {
    idsToSkip: number;
    limit: number;
    offset: number;
    name: string;
  }) {
    const foundUsers = await this.userRepository.searchUserByName({
      idsToSkip,
      limit,
      offset,
      name,
    });

    return RestFullAPI.onSuccess(
      STATUS_CODE.OK,
      STATUS_MESSAGE.SUCCESS,
      foundUsers,
    );
  }
}
