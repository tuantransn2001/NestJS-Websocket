import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  accessToken?: string;
  @ApiProperty()
  refreshToken?: string;
}
