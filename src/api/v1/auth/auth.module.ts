import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { LocalFile } from '../local-file/entities/localFile.entity';
import { ModelName } from '../common/enums/common';
import { DatabaseModule } from '../database/database.module';
import { LocalFileService } from '../local-file/local-file.service';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFile),
    UserService,
    LocalFileService,
    AuthService,
  ],
})
export class AuthModule {}
