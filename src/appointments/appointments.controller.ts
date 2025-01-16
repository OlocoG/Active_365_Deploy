import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointments } from 'src/entities/appointments.entity';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Rol(userRoles.member, userRoles.partner, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  async createAppointment(
  @Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointments> {
    const { userId, classId } = createAppointmentDto;
    return this.appointmentsService.createAppointment(userId, classId);
  }

  @Put('/cancel/:id')
  @Rol(userRoles.member, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  async cancelAppointment(@Param('id') appointmentId: string) {
    return await this.appointmentsService.cancelAppointment(appointmentId);
  }

  @Put(':id')
  @Rol(userRoles.member, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  async modifyAppointment(
      @Param('id') appointmentId: string,
      @Body('newClassId') newClassId: string
  ): Promise<any> {
      return this.appointmentsService.modifyAppointment(appointmentId, newClassId);
  }
  
}
