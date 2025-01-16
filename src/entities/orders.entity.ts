import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Users } from "./users.entity";
import { OrderDetails } from "./orderDetails.entity";
import { statusOrder } from "src/enums/status.enum";
@Entity({name: 'Orders'})
export class Orders {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column()
    date: Date;

    @ManyToOne(() => Users, (user) => user.orders)
    @JoinColumn()
    user: Users;

    @OneToOne(() => OrderDetails, (orderDetails) => orderDetails.order, { onDelete: 'CASCADE' })
    @JoinColumn()
    orderDetails: OrderDetails;

    @Column({ type: 'varchar', length: 10, nullable: false, default: statusOrder.pending })
    status: statusOrder;

}