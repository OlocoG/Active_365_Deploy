import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EmailModule } from 'src/email/email.module';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';



@Module({
  imports: [TypeOrmModule.forFeature([Users]), EmailModule, UserModule],
  providers: [NotificationsService],
})
export class NotificationsModule {}
