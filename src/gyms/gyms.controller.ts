import { Controller, Get, Post, Body, Param, Put, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { CreateGymDto } from '../dto/create-gym.dto';
import { GymReviewDto } from 'src/dto/review-gym.dto';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('gyms')
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get()
  findAll() {
    return this.gymsService.getGyms();
  }

  @Post('review')
  @Rol(userRoles.member)
  @UseGuards(AuthorizationGuard, RolesGuard)
  addReview(@Body() review: GymReviewDto){
    return this.gymsService.addReview(review);
  }
  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.gymsService.getById(id);
  }

  @Get(':id')
  @Rol(userRoles.member, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  findByClass(@Param('class') Class: string) {
    return this.gymsService.getByClass(Class);
  }

  @Put(':id')
  @Rol(userRoles.admin, userRoles.partner)
  @UseGuards(AuthorizationGuard, RolesGuard)
    updateGym(@Param('id', ParseUUIDPipe) id:string, @Body() gym: CreateGymDto){
        return this.gymsService.updateGym(id, gym)
  }

  @Put('/toggle-status/:id')
  @Rol(userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  toggleGymStatus(@Param('id') gymId: string) {
    return this.gymsService.toggleGymStatus(gymId);
  }
}
