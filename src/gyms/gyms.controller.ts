import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { CreateGymDto } from '../dto/create-gym.dto';
import { ProductReviewDto } from 'src/dto/review-product.dto';
import { GymReviewDto } from 'src/dto/review-gym.dto';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  findAll() {
    return this.gymsService.getGyms();
  }

  @Post('review')
  addReview(@Body() review: GymReviewDto){
    return this.gymsService.addReview(review);
  }
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.gymsService.getById(id);
  }

  @Get(':id')
  findByClass(@Param('class') Class: string) {
    return this.gymsService.getByClass(Class);
  }

  @Put(':id')
    updateGym(@Param('id', ParseUUIDPipe) id:string, @Body() gym: CreateGymDto){
        return this.gymsService.updateGym(id, gym)
  }

  @Put('/deactivate/:id')
    cancelAppointment(@Param('id') gymId: string) {
      return this.gymsService.deactivateGym(gymId);
  }
}
