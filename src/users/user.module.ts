import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Gyms } from 'src/entities/gyms.entity';
import { ReviewsGyms } from 'src/entities/reviewsGyms.entity';
import { FilesUploadModule } from 'src/files-upload/files-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), 
            TypeOrmModule.forFeature([Gyms]),
            TypeOrmModule.forFeature([ReviewsGyms]),
            FilesUploadModule
          ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
