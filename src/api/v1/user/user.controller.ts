import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetPagination,
  Pagination,
} from '../common/decorator/pagination.decorator';
import { SearchUserByNameDTO } from '../chat/dto/input';
import { UserService } from './user.service';
import LocalFilesInterceptor from '../common/interceptor/localFile.interceptor';
import { LocalFileService } from '../local-file/local-file.service';
import { UpdateUserDto } from '../auth/dto/input/updateUserDto';
import { GetOneDto } from './shared/user.interface';
import { ZodValidationPipe } from 'nestjs-zod';
import { SearchUserByNameSchema } from '../chat/shared/chat.shema';
import { GetOneSchema } from './shared/user.schema';
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly localFileService: LocalFileService,
  ) {}

  @Post('/search')
  @UsePipes(new ZodValidationPipe(SearchUserByNameSchema))
  public async searchUserByName(
    @Query() searchUserByNameDTO: SearchUserByNameDTO,
    @GetPagination() paginationDto: Pagination,
  ) {
    return await this.userService.searchUserByName({
      idsToSkip: 0,
      limit: paginationDto.limit,
      offset: paginationDto.offset,
      name: searchUserByNameDTO.name,
    });
  }
  @Get('/')
  @UsePipes(new ZodValidationPipe(GetOneSchema))
  public async findOne(@Query() getOneDto: GetOneDto) {
    return await this.userService.getOneUser(getOneDto.id);
  }
  @Patch('/profile')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
      fileFilter: (request, file, callback): any => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2), // 1MB
      },
    }),
  )
  @Patch('/profile')
  public async update(
    @Request() request: Request,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      // todo...
      // ? check file is exist or not
    }

    return await this.userService.updateProfile(updateUserDto);
  }
}
