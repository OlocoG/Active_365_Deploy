import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Users } from "./users.entity";
import { userRoles } from "src/enums/userRoles.enum";
import { Classes } from "./class.entity";
@Entity({name: 'Gyms'})
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
    
    @Column({type: 'varchar', length: 15, nullable: false, default: userRoles.partner})
    rol: string;

    @CreateDateColumn({ type: "date", nullable: false})
    createdAt: Date;

    @ManyToMany(() => Classes, classes => classes.gym)
    @JoinColumn()
    classes: Classes[];

    @OneToMany(() => Users, user => user.gym)
    @JoinColumn()
    users: Users[];
}