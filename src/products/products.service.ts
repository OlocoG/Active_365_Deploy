import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import * as data from "../seeders/products.json"
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entities/categories.entity';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import { FilesUploadService } from 'src/files-upload/files-upload.service';
import { FilterProductsDto } from 'src/dto/createProduct.dto';
import { ReviewsProducts } from 'src/entities/reviewsProducts.entity';
import { Users } from 'src/entities/users.entity';
import { ProductReviewDto } from 'src/dto/review-product.dto';
import { parse } from 'path';
import { statusProduct } from 'src/enums/status.enum';
import { CategoriesService } from 'src/categories/categories.service';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
    @InjectRepository(Products) 
    private productsRepository: Repository<Products>,
    @InjectRepository(Users) 
    private usersRepository: Repository<Users>,
    @InjectRepository(ReviewsProducts) 
    private reviewsRepository: Repository<ReviewsProducts>,
    private readonly filesUploadService: FilesUploadService,
) {}

  private async waitForCategories() {
    const pollInterval = 500;  
    const timeout = 20000;
    let elapsedTime = 0;

    while (elapsedTime < timeout) {
      const categoriesCount = await this.categoriesRepository.count();
      if (categoriesCount > 0) {
          return;
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      elapsedTime += pollInterval;
  }

    throw new Error('Timeout: Categories were not initialized in time.');
  }

  async onModuleInit() {
    const categoriesCount = await this.categoriesRepository.count();
    if (categoriesCount ===0) {
      console.log('No categories found, initializing categories...');
      const categoriesService = new CategoriesService(this.categoriesRepository)
      await categoriesService.addCategories();
    }

    await this.waitForCategories();

    const categories = await this.categoriesRepository.find();
    if (categories.length === 0) {
        throw new Error('No se encontraron categorías para asociar los productos');
    }

    for (const element of data) {
        const category = categories.find(
            (category) => category.name === element.category,
        );

        if (!category) {
            console.warn(`Categoría no encontrada para el producto ${element.name}`);
            continue;
        }

        const product = new Products();
        product.name = element.name;
        product.description = element.description;
        product.imgUrl = element.imgUrl;
        product.price = element.price;
        product.stock = element.stock;
        product.category = category;
        product.subcategory = element.subcategory;

        await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Products)
        .values(product)
        .orUpdate(['description', 'price', 'stock', 'subcategory'], ['name'])
        .execute();
    }

    return "Products added";
  }
  
  async getProducts(filterDto?: FilterProductsDto) {
    const { category, subcategory } = filterDto || {};
  
    const query = this.productsRepository.createQueryBuilder('product');
  
    query
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .groupBy('product.id')
      .addGroupBy('category.name');
  
    if (category) {
      query.andWhere('category.name = :category', { category });
    }
  
    if (subcategory) {
      query.andWhere('product.subcategory = :subcategory', { subcategory });
    }
  
    query.select([
      'product.id', 
      'product.name', 
      'product.description', 
      'product.price', 
      'product.stock', 
      'product.imgUrl',
      'product.subcategory',
      'category.name',
      'product.status',
      'AVG(reviews.rating) as rating',
    ]);
  
    const products = await query.getRawMany();
  
    if (products.length === 0) {
      throw new NotFoundException('No products were found matching the criteria.');
    }
  
    const mappedProducts = products.map(product => ({
      id: product.product_id,
      name: product.product_name,
      description: product.product_description,
      price: product.product_price,
      stock: product.product_stock,
      imgUrl: product.product_imgUrl,
      subcategory: product.product_subcategory,
      category: { name: product.category_name },
      status: product.product_status,
      rating: parseFloat(parseFloat(product.rating).toFixed(2)),
    }));
  
    return mappedProducts;
  }
  

  async getProductById(id: string) {
    const product = await this.productsRepository.findOne({
        where: { id: id },
        relations: ['category', 'reviews'],
        select: [
            'id', 'name', 'description', 'price', 'stock', 'imgUrl', 'category', 'subcategory', 'reviews', 'status'
        ]
    });

    if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found..`);
    }

    product.reviews = product.reviews.map(review => ({
        ...review,
        rating: typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating
    }));

    return product;
  }

  async createProduct(product:any, file: Express.Multer.File) {
    const categoryFound = await this.categoriesRepository.findOne({
      where: { name: product.category }
    });
    if (!categoryFound) {
      throw new NotFoundException(`Category with name "${product.category}" not found.`);
    }

    let image: string = 'https://example.com/default-image.jpg';
    if (file) {
      const uploadImage = await this.filesUploadService.uploadImage(file);
      image = uploadImage.secure_url;
    }

    const newProduct = this.productsRepository.create({
      ...product,
      category: categoryFound,
      imgUrl: image
    });
    return await this.productsRepository.save(newProduct);
  }

  async updateProduct(id: string, product: any, file?:Express.Multer.File) {
    const productUpdate = await this.productsRepository.findOne({
      where: { id },
      relations: ['category'] 
    });
    if (!productUpdate) {
        throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (product.category) {
    const categoryFound = await this.categoriesRepository.findOne({
      where: { name: product.category },
    });
    if (!categoryFound) {
      throw new NotFoundException(`Category with name "${product.category}" not found.`);
    }
    productUpdate.category = categoryFound;
    }

    if (file) {
      const uploadImage = await this.filesUploadService.uploadImage(file);
      productUpdate.imgUrl = uploadImage.secure_url;
    }

    Object.assign(productUpdate, { ...product, category: productUpdate.category });
    return await this.productsRepository.save(productUpdate);
  }

  async getProductsByCategory(categoryId: string) {
    const products = await this.productsRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category'],
      select: ['id', 'name', 'description', 'price', 'stock', 'imgUrl', 'category', 'subcategory', 'status']
    });
  
    if (products.length === 0) {
      throw new NotFoundException(`No products found for category with ID ${categoryId}.`);
    }
    return products;
  }
  async addReview(review: ProductReviewDto) {
    const product = await this.productsRepository.findOne({
        where: { id: review.productId },
        relations: ['reviews', 'reviews.userId']
    });
    if (!product) {
        throw new NotFoundException(`Product with ID ${review.productId} not found.`);
    }

    const user = await this.usersRepository.findOne({
        where: { id: review.userId },
        relations: ['orders', 'orders.orderDetails', 'orders.orderDetails.orderProducts', 'orders.orderDetails.orderProducts.product']
    });
    if (!user) {
        throw new NotFoundException(`User with ID ${review.userId} not found.`);
    }

    const hasPurchasedProduct = user.orders.some(order => 
        order.orderDetails.orderProducts.some(orderProduct => 
            orderProduct.product && orderProduct.product.id === review.productId
        )
    );
    if (!hasPurchasedProduct) {
        throw new ForbiddenException(`The user has not purchased this product to make a review.`);
    }
    const existingReview = product.reviews.find(rev => rev.userId.id === review.userId);

    if (existingReview) {
        existingReview.rating = review.rating;
        existingReview.comment = review.comment;
        await this.reviewsRepository.save(existingReview);
        return {
          message: `Review update done.`,
      };
    } else {
        const newReview = new ReviewsProducts();
        newReview.productId = product;
        newReview.userId = user;
        newReview.rating = review.rating;
        newReview.comment = review.comment;
        await this.reviewsRepository.save(newReview);

        product.reviews.push(newReview);
        await this.productsRepository.save(product);
        return {
            message: `Review done.`,
        }
    }
}

  async getRandomProducts(limit: number): Promise<Products[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .orderBy('RANDOM()') 
      .limit(limit)
      .getMany();
  }

  async toggleProductStatus(productId: string): Promise<{ message: string }> {  
        const product = await this.productsRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found.`);
        }
        
        if (product.status === statusProduct.active) {
            product.status = statusProduct.inactive; 
        } else if (product.status === statusProduct.inactive) {
            product.status = statusProduct.active; 
        } else {
            throw new Error('Unexpected product status.');
        }
    
        await this.productsRepository.save(product);
        return { message: `Product with ID ${productId} has been ${product.status === statusProduct.active ? 'activated' : 'deactivated'} successfully.` };
      }
}
