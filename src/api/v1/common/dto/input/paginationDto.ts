import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class PaginationDto {
  @Field()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  limit?: number;

  @Field()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  offset?: number;

  @Field()
  @IsOptional()
  @Transform(({ value }) => String(value))
  @IsString()
  search?: string;
}
