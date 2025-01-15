import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { ProductOrderDto } from 'src/dto/product-order.dto';
import { OrderDetails } from 'src/entities/orderDetails.entity';
import { OrderProduct } from 'src/entities/orderProduct.entity';
import { Orders } from 'src/entities/orders.entity';
import { Products } from 'src/entities/products.entity';
import { Users } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { userRoles } from 'src/enums/userRoles.enum';
import { MembershipService } from 'src/membership/membership.service';

@Injectable()
export class OrdersService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(Orders)
        private ordersRepository: Repository<Orders>,
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(OrderDetails)
        private orderDetailsRepository: Repository<OrderDetails>,
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
        private readonly emailService: EmailService,
        private readonly membershipService: MembershipService,
    ){}

    async createOrder(userId: string, products: ProductOrderDto[]) {
        return await this.dataSource.transaction(async (manager) => {
            const user = await manager.findOne(Users, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
    
            const order = new Orders();
            order.date = new Date();
            order.user = user;
            const newOrder = await manager.save(order);

            const orderDetails = new OrderDetails();
            orderDetails.order = newOrder;

            let totalPrice = 0;
            const OrderProducts = [];
            let membershipPurchased = null;

            for (const { productId, quantity } of products) {
                const product = await manager.findOne(Products, { 
                    where: { id: productId },
                    relations: ['category'],
                });
                if (!product || product.stock < quantity) {
                    throw new NotFoundException(`Product with id ${productId} is unavailable`);
                }
                const orderProduct = new OrderProduct();
                orderProduct.product = product;
                orderProduct.quantity = quantity;
                orderProduct.orderDetails = orderDetails;
                orderProduct.price = Number(product.price) * quantity;
                totalPrice += orderProduct.price;

                product.stock -= quantity;
                await manager.save(product);
                OrderProducts.push(orderProduct);

                if (product.category.name.toLowerCase() === 'memberships') {
                    membershipPurchased = product.name.toLowerCase();
                }
            }
            orderDetails.totalPrice = totalPrice;
            orderDetails.orderProducts = OrderProducts;
            await manager.save(orderDetails);

            newOrder.orderDetails = orderDetails;

            if (membershipPurchased && user.rol !== userRoles.member) {
                user.rol = userRoles.member;
                user.membershipExpiresAt = this.membershipService.calculateMembershipExpiration(membershipPurchased);
                await manager.save(user);
                await this.emailService.sendMembershipConfirmationEmail(
                    user.email,
                    {
                        user: user,
                        product: {
                            name: membershipPurchased, 
                        },
                        expirationDate: user.membershipExpiresAt.toISOString().split('T')[0],
                    },
                );
            }

            await manager.save(newOrder);
            await this.emailService.sendOrderConfirmationEmail(
                user.email,
                {
                    user: user,
                    date: newOrder.date,
                    orderDetails,
                    totalPrice,
                    products: OrderProducts.map((orderProduct) => ({
                        name: orderProduct.product.name,
                        quantity: orderProduct.quantity,
                        price: orderProduct.price,
                    })),
                },
            );
            return manager.findOne(Orders, { where: { id: newOrder.id }, relations: ['orderDetails'] });
        });

    }
    
    
    async getOrder(id: string){
        const order = await this.ordersRepository.findOne({
            where: {id},
            relations: ['orderDetails']
        });
        if (!order) {
            throw new NotFoundException (`Order with id ${id} was not found`);
        }
        return order;
    }

    // async updateOrder(id: string, userId: string, products: ProductOrderDto[]) {
    //     return await this.dataSource.transaction(async (manager) => {
    //         const order = await manager.findOne(Orders, { where: { id } });
    //         if (!order) {
    //             throw new NotFoundException(`Order with id ${id} not found`);
    //         }
    //         if (order.user.id !== userId) {
    //             throw new BadRequestException('You are not allowed to update this order');
    //         }
    //         const orderDetails = await manager.findOne(OrderDetails, { where: { order: order } });
    //         if (!orderDetails) {
    //             throw new NotFoundException(`Order details for order with id ${id} not found`);
    //         }
    //         const orderProducts = await manager.find(OrderProduct, { where: { orderDetails } });
    //         for (const orderProduct of orderProducts) {
    //             const product = await manager.findOne(Products, { where: { id: orderProduct.product.id } });
    //             product.stock += orderProduct.quantity;
    //             await manager.save(product);
    //             await manager.remove(orderProduct);
    //         }
    //         await manager.remove(orderDetails);
    //         order.orderDetails = null;
    //         await manager.save(order);
    //         return await this.createOrder(userId, products);
    //     });
    // }
    
    
}
