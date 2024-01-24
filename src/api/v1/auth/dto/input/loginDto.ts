import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class LoginDto {
  @ApiProperty({ required: true })
  @IsString()
  phone?: string;
  @ApiProperty({ required: true })
  @IsString()
  password?: string;
}
