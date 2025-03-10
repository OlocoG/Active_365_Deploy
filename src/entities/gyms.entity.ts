import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  import { v4 as uuid } from 'uuid';
  import { Users } from './users.entity';
  import { Classes } from './class.entity';
  import { userRoles } from 'src/enums/userRoles.enum';
import { ReviewsGyms } from './reviewsGyms.entity';
import { statusGym } from 'src/enums/status.enum';
  
  @Entity({ name: 'Gyms' })
  export class Gyms {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column({ length: 50, nullable: false })
    name: string;
  
    @Column({ length: 50, unique: true, nullable: false })
    email: string;
  
    @Column({ length: 100, nullable: true })
    password: string;
  
    @Column({ length: 100, nullable: true })
    googlePassword: string;
  
    @Column({ type: 'bigint', nullable: true })
    phone: number;
  
    @Column({ type: 'text', nullable: true })
    address: string;
  
    @Column({ length: 50, nullable: true })
    city: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude: number;
  
    @Column({ type: 'varchar', length: 15, nullable: false, default: userRoles.partner })
    rol: string;

    @Column({ type: "varchar", length: 10, nullable: false, default: statusGym.active })
    status: statusGym;
  
    @CreateDateColumn({ type: 'date', nullable: false })
    createdAt: Date;
  
    @OneToMany(() => Classes, (classes) => classes.gym)
    classes: Classes[];
  
    @OneToMany(() => Users, (user) => user.gym)
    users: Users[];

    @OneToMany(() => ReviewsGyms, (reviews) => reviews.gymId, {eager: true})
    reviews: ReviewsGyms[];
  }
  