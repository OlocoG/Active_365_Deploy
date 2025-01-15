import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { v4 as uuid } from 'uuid';
import { PrimaryGeneratedColumn } from "typeorm";
import { Gyms } from "./gyms.entity";
import { Orders } from "./orders.entity";
import { userRoles } from "src/enums/userRoles.enum";
import { Appointments } from "./appointments.entity";
import { ReviewsProducts } from "./reviewsProducts.entity";
import { ReviewsGyms } from "./reviewsGyms.entity";
import { statusUser } from "src/enums/status.enum";
@Entity({name: "Users"})
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ length: 50, unique: true, nullable: false })
    email: string;

    @Column({ type: 'bigint', nullable: true })
    phone?: number;

    @Column({ type: 'text', nullable: true })
    address?: string;

    @Column({ length: 50, nullable: true })
    city?: string;
    
    @Column({type: 'varchar', length: 15, nullable: false, default: userRoles.registered})
    rol: string;

    @Column({ type: "varchar", length: 10, nullable: false, default: statusUser.active })
    status: statusUser;
    
    @Column({ type: 'float', nullable: true })
    height?: number;

    @Column({ type: 'float', nullable: true })
    weight?: number;

    @Column({ length: 100 , nullable: true })
    password: string;

    @Column({ length: 100 , nullable: true })
    googlePassword: string;

    @Column({ type: 'text', nullable: false, default: 'https://example.com/default-image.jpg'})
    imgUrl: string
    
    @CreateDateColumn({ type: "date", nullable: false})
    createdAt: Date;

    @Column({ type: 'date', nullable: true })
    membershipExpiresAt: Date;
    
    @ManyToOne(() => Gyms, gym => gym.users)
    @JoinColumn()
    gym: Gyms;

    @OneToMany(() => Appointments, appointment => appointment.user )
    @JoinColumn()
    appointments: Appointments[];

    @OneToMany(() => Orders, order => order.user)
    @JoinColumn()
    orders: Orders[];

    @OneToMany(() => ReviewsProducts, (review) => review.userId)
    @JoinColumn()
    reviews: ReviewsProducts[];

    @OneToMany(() => ReviewsGyms, (review) => review.userId)
    @JoinColumn()
    reviewsGyms: ReviewsGyms[];
}