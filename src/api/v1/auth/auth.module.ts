import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { modelDefineProvider } from '../common/provider/modelDefine.provider';
import { LocalFileSchema } from '../local-file/entities/localFile.entity';
import { ModelName } from '../common/enums/common';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../user/repository/user.repository';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [
    ...modelDefineProvider(ModelName.LOCAL_FILE, LocalFileSchema),
    AuthService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
