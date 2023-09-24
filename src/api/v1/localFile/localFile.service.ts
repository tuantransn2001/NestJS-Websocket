import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MODEL_NAME } from '../ts/enums/common';
import { CreateLocalFileDTO } from './dto/input';
import { ILocalFile } from './shared/localFile.interface';

@Injectable()
class LocalFileService {
  constructor(
    @Inject(MODEL_NAME.LOCAL_FILE)
    private localFileModel: Model<ILocalFile>,
  ) {}

  public async saveLocalFileData(fileData: CreateLocalFileDTO) {
    const newFile = await this.localFileModel.create(fileData);
    await this.localFileModel.create(newFile);
    return newFile;
  }
}

export default LocalFileService;
