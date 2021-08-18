import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Item } from './item.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'lines' })
export class TransactionLine extends BasicFields {
  @ManyToOne(() => TransactionHeader, (tran) => tran.lines)
  header: TransactionHeader;

  @ManyToOne(() => Item)
  item: Item;

  @Column()
  @Field()
  lineNumber: number;
  @Column({ type: 'decimal' })
  @Field()
  unit: number;
  @Column({ type: 'decimal' })
  @Field()
  eachPrice: number;
  @Column({ type: 'decimal' })
  @Field()
  linePrice: number;
}
