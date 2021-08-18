import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Item } from './item.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'inventories' })
export class Inventory extends BasicFields {
  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;

  @ManyToOne(() => Item)
  item: Item;

  @Column()
  @Field()
  qtyOnHand: number;
}
