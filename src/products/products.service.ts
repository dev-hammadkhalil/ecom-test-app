import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { responseFunction } from '../utils.ts/response-function';
import { InjectRepository } from '@nestjs/typeorm';
import { groupBy } from 'lodash';
import { FilterProductDto } from './dto/filter-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto, userId: number) {
    const result = await this.productRepository.save({
      ...createProductDto,
      user: { id: userId },
    });

    if (!result) {
      return responseFunction(400, 'Failed to create product');
    }

    const { user, ...productData } = result;
    const response = {
      ...productData,
      uploadedBy: user.id,
    };
    return responseFunction(200, 'Success', response);
  }

  async getAllProducts(productFilterAndSearchPayload: FilterProductDto) {
    const { search, category, minPrice, maxPrice } =
      productFilterAndSearchPayload;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .select([
        'product',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
      ])
      .where('product.stock != :stock', { stock: 0 });

    if (search) {
      queryBuilder.andWhere('(LOWER(product.title) LIKE LOWER(:search))', {
        search: `%${search}%`,
      });
    }

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (minPrice || maxPrice) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: minPrice || 1,
        maxPrice: maxPrice || 99999,
      });
    }

    const allProducts = await queryBuilder.getMany();

    if (!allProducts.length) {
      return responseFunction(404, 'No products found');
    }

    return responseFunction(
      200,
      'Success',
      groupBy(allProducts, 'category') || [],
    );
  }

  async findProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });

    if (!product) {
      return responseFunction(404, 'Product not found');
    }
    return responseFunction(200, 'Success', product);
  }

  async updateProductById(
    id: number,
    updateProductDto: UpdateProductDto,
    userId: number,
  ) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
          user: {
            id: userId,
          },
        },
      });

      if (!product) {
        return responseFunction(404, 'Invalid product id');
      }

      await this.productRepository.update(id, updateProductDto);

      const updatedProduct = await this.productRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          user: true,
        },
        select: {
          user: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      });

      return responseFunction(200, 'Success', updatedProduct);
    } catch (error) {
      console.error(error);
      return responseFunction(400, 'Failed to update product');
    }
  }

  async deleteProductById(id: number, userId: number) {
    try {
      const product = await this.productRepository.findOne({
        where: {
          id: id,
          user: {
            id: userId,
          },
        },
      });

      if (!product) {
        return responseFunction(404, 'Product not found');
      }

      await this.productRepository.delete(id);

      console.info(
        `Product with id ${id} successfully deleted by user ${userId}`,
      );

      return responseFunction(200, 'Success');
    } catch (error) {
      console.error(error);
      return responseFunction(400, 'Failed to delete product');
    }
  }
}
