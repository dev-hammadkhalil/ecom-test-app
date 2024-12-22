import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PRODUCT_CATEGORIES } from '../constants';
import { Transform } from 'class-transformer';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PRODUCT_CATEGORIES)
  category?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  maxPrice?: number;
}
