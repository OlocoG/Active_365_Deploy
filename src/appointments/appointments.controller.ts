import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { Appointments } from 'src/entities/appointments.entity';
import { CreateAppointmentDto } from 'src/dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  createAppointment(
  @Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointments> {
    const { userId, classId } = createAppointmentDto;
    return this.appointmentsService.createAppointment(userId, classId);
  }

  @Put('/cancel/:id')
  cancelAppointment(@Param('id') appointmentId: string) {
    return this.appointmentsService.cancelAppointment(appointmentId);
  }

  @Put(':id')
  modifyAppointment(
      @Param('id') appointmentId: string,
      @Body('newClassId') newClassId: string
  ): Promise<any> {
      return this.appointmentsService.modifyAppointment(appointmentId, newClassId);
  }
  
}
