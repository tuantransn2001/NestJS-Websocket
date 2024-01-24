import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { LocalFileService } from '../local-file/local-file.service';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { LocalFile } from '../local-file/entities/localFile.entity';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    UserService,
    LocalFileService,
  ],
})
export class UserModule {}
