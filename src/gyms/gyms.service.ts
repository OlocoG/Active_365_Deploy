import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gyms } from 'src/entities/gyms.entity';
import { Repository } from 'typeorm';
import * as data from '../seeders/gyms.json'
import * as bcrypt from 'bcrypt'
import { statusGym } from 'src/enums/status.enum';
import { Users } from 'src/entities/users.entity';
import { GymReviewDto } from 'src/dto/review-gym.dto';
import { ReviewsGyms } from 'src/entities/reviewsGyms.entity';


@Injectable()
export class GymsService {
  
  constructor(
    @InjectRepository(Gyms)
    private gymsRepository: Repository<Gyms>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(ReviewsGyms)
    private reviewsRepository: Repository<ReviewsGyms>,
  ) {}

  async addGyms() {
    for (const gym of data.gyms) {
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(gym.password, saltRounds);
      
      const newGym = new Gyms();
      newGym.name = gym.name;
      newGym.email= gym.email;
      newGym.password = hashedPassword;
      newGym.phone = gym.phone;
      newGym.address = gym.address;
      newGym.city = gym.city;
      newGym.latitude = gym.latitude;
      newGym.longitude = gym.longitude;

      await this.gymsRepository
      .createQueryBuilder()
      .insert()
      .into(Gyms)
      .values(newGym)
      .orUpdate(['password', 'phone', 'address', 'city', 'name', 'latitude', 'longitude'], ['email'])
      .execute()
    };
    return `The Gyms have been added`
  }
  
  async getGyms() {
    const gyms = await this.gymsRepository.find({
      relations: ['users', 'classes'],
      select: ['id', 'name', 'email', 'phone' ,'address', 'city', 'latitude', 'longitude', 'rol', 'createdAt', 'users', 'status'],
    });
    if(gyms.length === 0) {
      throw new NotFoundException('No gyms registered in the database were found');
    };
    return gyms;
  }
  
  async getById(id: string) {
    const gymFound = await this.gymsRepository.findOne({
      where: { id: id },
      relations: ['users', 'classes', 'reviews'],
      select: ['id', 'name', 'email', 'phone' ,'address', 'city', 'latitude', 'longitude', 'rol', 'createdAt', 'users', 'classes', 'reviews', 'status'],
  });
  if (!gymFound) {
      throw new NotFoundException(`Gym with ID ${id} not found.`);
  }
  gymFound.reviews = gymFound.reviews.map(review => ({
    ...review,
    rating: typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating
}));

return gymFound;
  }
  
  async getByClass(classId: string) {
    const gyms = await this.gymsRepository.find({
      relations: ['classes'],
      where: {
        classes: {id: classId},
      },
      select: ['id', 'name', 'email', 'phone', 'address', 'classes', 'status']
    });

    if (!gyms || gyms.length === 0) {
      throw new NotFoundException(`No gyms found for the class with ID ${classId}.`);
    }

    return gyms.map(gym => ({
      ...gym,
      classes: gym.classes.map(clss => ({
          id: clss.id,
          name: clss.name
      }))
  }));
  }

  async updateGym(id: string, gym: Partial<Gyms>) {
    const gymUpdate = await this.gymsRepository.findOneBy({id});
    if(!gymUpdate) {
      throw new NotFoundException(`Gym with ID ${id} not found.`);
    }
    Object.assign(gymUpdate, gym);
    await this.gymsRepository.save(gymUpdate)
    return {
      message: `Gym with ID ${id} has been succesfully modified`
    }
  }

  async toggleGymStatus(gymId: string): Promise<{ message: string }> {  
        const gym = await this.gymsRepository.findOne({ where: { id: gymId } });
        if (!gym) {
            throw new NotFoundException(`Gym with ID ${gymId} not found.`);
        }
        
        if (gym.status === statusGym.active) {
            gym.status = statusGym.inactive; 
        } else if (gym.status === statusGym.inactive) {
            gym.status = statusGym.active; 
        } else {
            throw new Error('Unexpected Gym status.');
        }
    
        await this.gymsRepository.save(gym);
        return { message: `Gym with ID ${gymId} has been ${gym.status === statusGym.active ? 'activated' : 'deactivated'} successfully.` };
      }

  async addReview(review: GymReviewDto) {
      const gym = await this.gymsRepository.findOne({
          where: { id: review.gymId },
          relations: ['reviews', 'reviews.userId']
      });
      if (!gym) {
          throw new NotFoundException(`Gym with ID ${review.gymId} not found.`);
      }
  
      const user = await this.usersRepository.findOne({
          where: { id: review.userId },
          relations: ['gym', 'gym.reviews']
      });
      if (!user) {
          throw new NotFoundException(`User with ID ${review.userId} not found.`);
      }
  
      const hasMembership = user.gym && user.gym.id === review.gymId;
      if (!hasMembership) {
          throw new ForbiddenException(`The user has not have a membership on this gym`);
      }
      const existingReview = gym.reviews.find(rev => rev.userId.id === review.userId);
  
      if (existingReview) {
          existingReview.rating = review.rating;
          existingReview.comment = review.comment;
          await this.reviewsRepository.save(existingReview);
          return {
            message: `Review update done.`,
        };
      } else {
          const newReview = new ReviewsGyms();
          newReview.gymId = gym;
          newReview.userId = user;
          newReview.rating = review.rating;
          newReview.comment = review.comment;
          await this.reviewsRepository.save(newReview);
  
          gym.reviews.push(newReview);
          await this.gymsRepository.save(gym);
          return {
              message: `Review done.`,
          }
      }
  }

}
