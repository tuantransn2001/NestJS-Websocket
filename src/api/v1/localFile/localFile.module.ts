import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { modelDefineProvider } from '../common/provider';
import { MODEL_NAME } from '../ts/enums/common';
import { LocalFile } from './entities/localFile.entity';
import LocalFilesService from './localFile.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(MODEL_NAME.LOCAL_FILE, LocalFile),
    LocalFilesService,
  ],
  exports: [LocalFilesService],
})
export class LocalFileModule {}
