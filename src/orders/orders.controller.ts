import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get(':id')
  @Rol(userRoles.registered, userRoles.admin, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  getOrder(@Param('id', ParseUUIDPipe) id:string){
    return this.ordersService.getOrder(id);
  }
  
  // @Put(':id')
  // updateOrder(@Param('id', ParseUUIDPipe) id:string, @Body() order: CreateOrderDto) {
  //   const { userId, products } = order;
  //   return this.ordersService.updateOrder(id, userId, products);
  // }
  
  @Post()
  @Rol(userRoles.registered, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  createOrder(@Body() order: CreateOrderDto) {
      const { userId, products } = order;
      return this.ordersService.createOrder(userId, products);
  }

}
