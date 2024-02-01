import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';

import {
  CreateLocalFileDto,
  UpdateLocalFileDto,
} from './shared/localFile.interface';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api.enum';
import { UpdateLocalFileSchema } from './shared/localFile.schema';
import { ILocalFileRepository } from './repository/ilocalfile.repository';
@Injectable()
export class LocalFileService {
  constructor(
    @Inject('LocalFileRepository')
    private readonly localFileRepository: ILocalFileRepository,
  ) {}

  public async updateOne(payload: UpdateLocalFileDto) {
    try {
      const { id, ...file } = UpdateLocalFileSchema.parse(payload);
      const foundLocalFile = await this.localFileRepository.findOneById(id);
      if (foundLocalFile) return handleErrorNotFound('File do not exist');

      const response = await this.localFileRepository.update(id, file);

      return RestFullAPI.onSuccess(
        STATUS_CODE.OK,
        STATUS_MESSAGE.SUCCESS,
        response,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }

  public async create(payload: CreateLocalFileDto) {
    try {
      const { fileName, path, mimeType } = payload;

      const response = await this.localFileRepository.create({
        id: uuidv4(),
        fileName: fileName,
        path: path,
        mimeType: mimeType,
      });

      return RestFullAPI.onSuccess(
        STATUS_CODE.CREATED,
        STATUS_MESSAGE.SUCCESS,
        response,
      );
    } catch (err) {
      return errorHandler(err);
    }
  }
}
