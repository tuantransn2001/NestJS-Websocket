import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { LocalFileSchema } from './entities/localFile.entity';
import { LocalFileRepository } from './repository/localfile.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFileSchema),
    {
      provide: 'LocalFileRepository',
      useValue: LocalFileRepository,
    },
  ],
})
export class LocalFileModule {}
