import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { ModelName } from '../common/enums/common';
import { Model } from 'mongoose';
import {
  CreateLocalFileDto,
  ILocalFile,
  UpdateLocalFileDto,
} from './shared/localFile.interface';
import { RestFullAPI, errorHandler, handleErrorNotFound } from '../utils';
import { STATUS_CODE, STATUS_MESSAGE } from '../common/enums/api_enums';
import {
  CreateLocalFileSchema,
  UpdateLocalFileSchema,
} from './shared/localFile.schema';
@Injectable()
export class LocalFileService {
  constructor(
    @Inject(ModelName.LOCAL_FILE)
    private readonly localFileModel: Model<ILocalFile>,
  ) {}

  public async findUniq(id?: string) {
    const foundLocalFile = await this.localFileModel.findOne({
      id,
    });

    return foundLocalFile ? foundLocalFile : undefined;
  }

  public async updateOne(payload: UpdateLocalFileDto) {
    try {
      const { id, ...rest } = UpdateLocalFileSchema.parse(payload);
      const foundLocalFile = await this.findUniq(id);
      if (foundLocalFile) return handleErrorNotFound('File do not exist');

      const response = await this.localFileModel.findOneAndUpdate(
        {
          id: id,
        },
        { ...rest },
      );

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
      const { fileName, path, mimeType } = CreateLocalFileSchema.parse(payload);

      const response = await this.localFileModel.create({
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
