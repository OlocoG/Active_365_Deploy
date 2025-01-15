import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from 'src/dto/create-class.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagesPipe } from 'src/files-upload/file-validation.pipe';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';


@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  
  @Get()
  getClassesByGymId(@Query('gymId') gymId: string) {
    return this.classesService.getClassesByGymId(gymId);
  }

  @Get('/all')
  getClasses() {
    return this.classesService.getClasses();
  }
  
  @Get('/gym/:name')
  getClasssesByGymName(@Param('name') name: string) {
    return this.classesService.getClassesByGymName(name);
  }

  @Get(':id')
  getClassesById(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.getClassesById(id);
  }

  @Post()
  @Rol(userRoles.partner, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  addClasses(
    @Body() classes: CreateClassDto,
    @UploadedFile(ValidateImagesPipe) file?: Express.Multer.File,
  ) {
    const { name, description, capacity, duration, date, time, gymId } =
      classes;
    return this.classesService.addClasses(
      name,
      description,
      capacity,
      duration,
      date,
      time,
      gymId,
      file,
    );
  }

  @Put(':id')
  @Rol(userRoles.partner, userRoles.admin)
  @UseGuards(AuthorizationGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  updateClasses(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() classes: Partial<CreateClassDto>,
    @UploadedFile(ValidateImagesPipe) file?: Express.Multer.File,
  ) {
    return this.classesService.updateClasses(id, classes, file);
  }
}
