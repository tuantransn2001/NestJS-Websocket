import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { LocalFile } from './entities/localFile.entity';
import { LocalFileRepository } from './repository/localfile.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    {
      provide: 'LocalFileRepository',
      useValue: LocalFileRepository,
    },
  ],
})
export class LocalFileModule {}
