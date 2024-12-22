import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PRODUCT_CATEGORIES } from '../constants';
import { User } from '../../users/entities/user.entity';

@Entity('Product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: Object.values(PRODUCT_CATEGORIES),
    nullable: false,
  })
  category: string;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.product, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;
}
