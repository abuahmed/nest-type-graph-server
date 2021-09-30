import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { AfterInsert, AfterLoad, AfterUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Item } from './item.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'lines' })
export class TransactionLine extends BasicFields {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  headerId: number;
  @ManyToOne(() => TransactionHeader, (tran) => tran.lines, { cascade: true })
  header: TransactionHeader;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  itemId: number;
  @ManyToOne(() => Item)
  item: Item;

  // @Column({ type: 'int' })
  // @Field(() => Int)
  // lineNumber: number;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float)
  qty: number;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float)
  eachPrice: number;

  //FOR PHYSICAL INVENTORY PURPOSE
  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float, { defaultValue: 0 })
  diff: number;
  // @Column({ type: 'decimal' })
  // @Field(() => Float)
  // linePrice: number;

  @Field(() => Float, { nullable: true })
  totalPurchaseSaleValue?: number;

  @Field(() => Float, { nullable: true })
  totalPIValue?: number;

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateSummary() {
    this.totalPurchaseSaleValue = Number.parseFloat((this.qty * this.eachPrice).toFixed(10));
    this.totalPIValue = Number.parseFloat((this.qty * this.diff).toFixed(10));
  }
}
