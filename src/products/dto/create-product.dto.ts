import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PRODUCT_CATEGORIES } from '../constants';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(PRODUCT_CATEGORIES)
  category: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
