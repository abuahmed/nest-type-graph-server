import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
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

  @Column({ type: 'decimal' })
  @Field()
  qtyOnHand: number;
}
