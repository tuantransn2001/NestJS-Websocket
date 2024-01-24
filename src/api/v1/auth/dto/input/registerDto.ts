import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { USER_STATUS, USER_TYPE } from 'src/api/v1/user/enum';

export class RegisterDto {
  @ApiProperty({ required: true, default: 'user@gmail.com' })
  @IsString()
  email?: string;
  @ApiProperty({ required: true, default: '0984250491' })
  @IsString()
  phone: string;
  @ApiProperty({ required: true, default: '@password!123PW' })
  @IsString()
  password: string;
  @ApiProperty({ required: true })
  @IsString()
  first_name: string;

  @ApiProperty({
    enum: USER_TYPE,
    isArray: true,
    example: Object.values(USER_TYPE),
  })
  @IsEnum(USER_TYPE, { each: true })
  type: USER_TYPE;

  @ApiProperty({
    enum: USER_STATUS,
    isArray: true,
    example: Object.values(USER_STATUS),
  })
  @IsEnum(USER_STATUS, { each: true })
  status: USER_STATUS;

  @ApiProperty()
  @IsString()
  last_name: string;
  @ApiProperty()
  @IsString()
  middle_name: string;
}
