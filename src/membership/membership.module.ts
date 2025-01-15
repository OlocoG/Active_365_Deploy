import { Module } from '@nestjs/common';
import { MembershipService } from './membership.service';
import { UserModule } from 'src/users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [MembershipService],
  exports: [MembershipService]
})
export class MembershipModule {}
