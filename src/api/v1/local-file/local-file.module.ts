import { Module } from '@nestjs/common';
import { LocalFileService } from './local-file.service';
import { DatabaseModule } from '../database/database.module';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { LocalFile } from './entities/localFile.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    LocalFileService,
    UserService,
  ],
})
export class LocalFileModule {}
