import { Body, Controller, Get, Param, ParseUUIDPipe, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from 'src/entities/users.entity';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Rol } from 'src/decorators/roles.decorator';
import { userRoles } from 'src/enums/userRoles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ValidateImagesPipe } from 'src/files-upload/file-validation.pipe';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    
    @Get()
    @Rol(userRoles.admin)
    @UseGuards(AuthorizationGuard, RolesGuard)
    getUsers(@Query ('page') page: number, @Query ('limit') limit: number) {
        if (page && limit) {
          return this.userService.getAllUsers(+page, +limit);
        }
        return this.userService.getAllUsers(1, 5);
      }
      
    @Get(':id')
    @UseGuards(AuthorizationGuard)
    getUserById(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.getUserById(id);
    }

    @Put(':id')
    @Rol(userRoles.registered, userRoles.member)
    @UseGuards(AuthorizationGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('file'))
    updateUser(
      @Param('id', ParseUUIDPipe) id: string, 
      @Body() user: Partial<Users>,
      @UploadedFile(ValidateImagesPipe) file?: Express.Multer.File
    ) {
        return this.userService.updateUser(id, user, file);
    }

    @Put('/toggle-status/:id')
    @Rol(userRoles.admin, userRoles.partner)
    @UseGuards(AuthorizationGuard, RolesGuard)
    toggleUserStatus(@Param('id') userId: string) {
      return this.userService.toggleUserStatus(userId);
    }
  
    @Put('/setadmin/:id')
    @Rol(userRoles.admin)
    @UseGuards(AuthorizationGuard, RolesGuard)
    setAdmin(@Param('id') userId: string) {
      return this.userService.setAdmin(userId);
    }

}
