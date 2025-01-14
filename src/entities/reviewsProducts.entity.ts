import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Users } from "./users.entity";
import { Products } from "./products.entity";
import { Exclude } from "class-transformer";
import { v4 as uuid } from 'uuid';
@Entity({name: 'ReviewsProducts'})
export class ReviewsProducts {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    rating: number

    @Column({type: 'text'})
    comment: string;

    @ManyToOne(() => Users, (user) => user.reviews)
    @JoinColumn()
    userId: Users;

    @ManyToOne(() => Products, (product) => product.reviews)
    @JoinColumn()
    @Exclude()
    productId: Products;
}

