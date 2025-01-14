import { Module, OnModuleInit } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gyms } from 'src/entities/gyms.entity';
import { Users } from 'src/entities/users.entity';
import { ReviewsGyms } from 'src/entities/reviewsGyms.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gyms]),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([ReviewsGyms]),
  ],
  controllers: [GymsController],
  providers: [GymsService],
  exports: [GymsService]
})
export class GymsModule implements OnModuleInit{
  constructor(private readonly gymsService: GymsService) {}

  async onModuleInit() {
    await this.gymsService.addGyms();
  }
}
