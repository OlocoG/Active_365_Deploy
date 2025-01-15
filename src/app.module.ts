import { Module } from '@nestjs/common';
import typeorm from './config/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/user.module';
import { GymsModule } from './gyms/gyms.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

import { OrdersModule } from './orders/orders.module';
import { AuthUsersModule } from './auth/auth-user/auth-users.module';
import { AuthGymsModule } from './auth/auth-gyms/auth-gyms.module';
import { ClassesModule } from './classes/classes.module';
import { JwtModule } from '@nestjs/jwt';
import { StripeModule } from './stripe/stripe.module';

import { EmailModule } from './email/email.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppointmentsModule } from './appointments/appointments.module';
import { MembershipModule } from './membership/membership.module';
@Module({
  imports: [
    CategoriesModule,
    GymsModule,
    UserModule,
    ProductsModule,
    OrdersModule,
    ConfigModule.forRoot({
    isGlobal: true,
    load: [typeorm],
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => config.get('typeorm'),
  }),
  JwtModule.register({
    global: true,
    signOptions: { expiresIn: '1d' },
    secret: process.env.JWT_SECRET,
  }),
  ScheduleModule.forRoot(),
  AuthGymsModule,
  AuthUsersModule,
  ClassesModule,
  StripeModule,
  EmailModule,
  NotificationsModule,
  AppointmentsModule,
  MembershipModule
  ]
})
export class AppModule {}