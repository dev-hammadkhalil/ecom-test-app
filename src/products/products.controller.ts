import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { responseFunction } from 'src/utils.ts/response-function';
import { FilterProductDto } from './dto/filter-product.dto';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { UserRoles } from 'src/users/constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles('admin')
  @UseGuards(JwtGuard, RoleGuard)
  @Post('create')
  create(@Body() createProductDto: CreateProductDto, @Req() req) {
    try {
      const userId = req?.user?.id;

      if (!userId) {
        throw responseFunction(401, 'Uploader user id is required');
      }
      return this.productsService.create(createProductDto, userId);
    } catch (error) {
      return error;
    }
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get()
  getAllProducts(@Query() productFilterAndSearchPayload: FilterProductDto) {
    return this.productsService.getAllProducts(productFilterAndSearchPayload);
  }

  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @UseGuards(JwtGuard, RoleGuard)
  @Get(':id')
  findProductById(@Param('id') id: string) {
    return this.productsService.findProductById(+id);
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch(':id')
  updateProductById(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    const productId = id;
    const userId = req?.user?.id;

    if (!productId || !userId) {
      throw responseFunction(400, 'Invalid product id');
    }

    return this.productsService.updateProductById(
      +productId,
      updateProductDto,
      userId,
    );
  }

  @Roles(UserRoles.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete(':id')
  deleteProductById(@Param('id') id: string, @Req() req) {
    const productId = id;
    const userId = req?.user?.id;

    if (!productId || !userId) {
      throw responseFunction(400, 'Invalid product id');
    }

    return this.productsService.deleteProductById(+productId, userId);
  }
}
