import * as dotenv from 'dotenv';

dotenv.config();

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from '../database/database.module';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { ModelName } from '../common/enums/common';
import { LocalFile } from '../local-file/entities/localFile.entity';
import { UserRepository } from './repository/user.repository';
import { LocalFileRepository } from '../local-file/repository/localfile.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'LocalFileRepository',
      useValue: LocalFileRepository,
    },
  ],
  exports: [],
})
export class UserModule {}
