import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Users } from "./users.entity";
import { Gyms } from "./gyms.entity";
@Entity({name: 'ReviewsGyms'})
export class ReviewsGyms {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    rating: number

    @Column({type: 'text'})
    comment: string;

    @ManyToOne(() => Users, (user) => user.reviews)
    @JoinColumn()
    userId: Users;

    @ManyToOne(() => Gyms, (gym) => gym.reviews)
    @JoinColumn()
    gymId: Gyms;
}