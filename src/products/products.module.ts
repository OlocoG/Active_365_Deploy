import { Module, OnModuleInit } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Categories } from 'src/entities/categories.entity';
import { FilesUploadModule } from 'src/files-upload/files-upload.module';
import { Type } from 'class-transformer';
import { Users } from 'src/entities/users.entity';
import { ReviewsProducts } from 'src/entities/reviewsProducts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories]),
    TypeOrmModule.forFeature([Products]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([ReviewsProducts]),
    FilesUploadModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, TypeOrmModule]
})
export class ProductsModule implements OnModuleInit{
  constructor(private readonly productsService: ProductsService) {}

  async onModuleInit() {
    // await this.productsService.addProducts();
  }
}
