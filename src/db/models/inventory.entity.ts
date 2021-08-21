import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Item } from './item.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'inventories' })
export class Inventory extends BasicFields {
  @ManyToOne(() => Warehouse, { nullable: false })
  warehouse: Warehouse;

  @ManyToOne(() => Item, { nullable: false })
  item: Item;

  @Column({ type: 'decimal' })
  @Field()
  qtyOnHand: number;
}
