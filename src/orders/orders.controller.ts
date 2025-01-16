import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from 'src/dto/create-order.dto';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  
  @ApiBearerAuth('access-token')
  @Rol(userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  @Get()
  getAllOrders(){
    return this.ordersService.getAllOrders();
  }  

  @ApiBearerAuth('access-token')
  @Post()
  @Rol(userRoles.registered, userRoles.admin, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  createOrder(@Body() order: CreateOrderDto) {
      const { userId, products } = order;
      return this.ordersService.createOrder(userId, products);
  }
  
  @ApiBearerAuth('access-token')
  @Put('cancel/:id')
  @Rol(userRoles.registered, userRoles.admin, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  deleteOrder(@Param('id', ParseUUIDPipe) orderId:string) {
    return this.ordersService.deleteOrder(orderId);
  } 

  @ApiBearerAuth('access-token')
  @Get('user/:id')
  @Rol(userRoles.registered, userRoles.admin, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  getOrdersByUser(@Param('id', ParseUUIDPipe) userId:string){
    return this.ordersService.getOrdersByUser(userId);
  }

  @ApiBearerAuth('access-token')
  @Get(':id')
  @Rol(userRoles.registered, userRoles.admin, userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  getOrder(@Param('id', ParseUUIDPipe) id:string){
    return this.ordersService.getOrder(id);
  }
  
}
