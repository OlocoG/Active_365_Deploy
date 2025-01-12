import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Categories } from "./categories.entity";
import { OrderProduct } from "./orderProduct.entity";
import { statusProduct } from "src/enums/status.enum";


@Entity({ name: "Products" })
export class Products {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();

    @Column({ length: 50, unique: true, nullable: false })
    name: string;

    @Column({type: 'text', nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @Column({ type: 'text', nullable: false, default: 'https://example.com/default-image.jpg'})
    imgUrl: string;

    @ManyToOne(() => Categories, (category) => category.product)
    @JoinColumn()
    category: Categories;

    @Column({ type: "varchar", length: 10, nullable: false, default: statusProduct.active })
    status: statusProduct;

    @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
    orderProducts: OrderProduct[];

    @Column({ type: 'text', nullable: true })
    subcategory: string;
}
