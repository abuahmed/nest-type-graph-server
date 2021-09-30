import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Item } from './item.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'inventories' })
export class Inventory extends BasicFields {
  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  warehouseId: number;

  @ManyToOne(() => Warehouse, { nullable: false })
  warehouse: Warehouse;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  itemId: number;

  @ManyToOne(() => Item, { nullable: false })
  item: Item;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float)
  qtyOnHand: number;

  @Field(() => Float, { nullable: true })
  totalPurchaseValue?: number;

  @Field(() => Float, { nullable: true })
  totalSaleValue?: number;

  @Field(() => Float, { nullable: true })
  totalProfitValue?: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateSummary() {
    this.totalPurchaseValue = this.item.purchasePrice * this.qtyOnHand;
    this.totalSaleValue = this.item.sellingPrice * this.qtyOnHand;
    this.totalProfitValue = this.totalSaleValue - this.totalPurchaseValue;
  }
}
