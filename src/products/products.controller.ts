import { Controller, Get, Post, Body, Param, ParseUUIDPipe, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from 'src/entities/products.entity';
import { CreateProductDto } from 'src/dto/createProduct.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagesPipe } from 'src/files-upload/file-validation.pipe';
import { ProductReviewDto } from 'src/dto/review-product.dto';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query('category') category?: string,
    @Query('subcategory') subcategory?: string,
    @Query('search') search?: string,
  ) {
    const filterDto = { category, subcategory, search };
    return this.productsService.getProducts(filterDto);
  }

  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id:string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @Rol(userRoles.admin, userRoles.partner)
  @UseGuards(AuthorizationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  createProduct(
    @Body() product: Partial<CreateProductDto>,
    @UploadedFile(ValidateImagesPipe) file?: Express.Multer.File,
  ){
    return this.productsService.createProduct(product, file);
  }

  @Post('review')
  @Rol(userRoles.registered, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  addReview( @Body() review: ProductReviewDto){
    return this.productsService.addReview(review);
  }

  @Put(':id')
  @Rol(userRoles.admin, userRoles.partner)
  @UseGuards(AuthorizationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateProduct(
    @Param('id', ParseUUIDPipe) id:string, 
    @Body() product: Partial<Products>,
    @UploadedFile(ValidateImagesPipe) file?: Express.Multer.File
  ){
    return this.productsService.updateProduct(id, product, file)
  }

  @Get('category/:categoryId')
  getProductsByCategory(@Param('categoryId') categoryId: string) {
  return this.productsService.getProductsByCategory(categoryId);
  }

  @Put('/toggle-status/:id')
  @Rol(userRoles.admin, userRoles.partner)
  @UseGuards(AuthorizationGuard, RolesGuard)
  toggleProductStatus(@Param('id') productId: string) {
    return this.productsService.toggleProductStatus(productId);
  }
}
