import { PartialType } from '@nestjs/swagger';
import { RegisterDto } from './registerDto';

export class UpdateUserDto extends PartialType(RegisterDto) {
  id: string;
}
