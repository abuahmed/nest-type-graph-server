import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeUpdate, Column, ManyToOne, OneToMany } from 'typeorm';
import { TransactionStatus } from '../enums/transactionStatus';
import { TransactionType } from '../enums/transactionType';
import { BusinessPartner } from '../models/businessPartner.entity';
import { TransactionLine } from '../models/transactionLine.entity';
import { Warehouse } from '../models/warehouse.entity';
import { BasicFields } from './basicFields';
registerEnumType(TransactionType, {
  name: 'TransactionType',
});

registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});
@ObjectType()
export abstract class TransactionFields extends BasicFields {
  @Column({
    default: TransactionType.Purchase,
    enum: TransactionType,
    type: 'enum',
  })
  @Field(() => TransactionType)
  type: TransactionType;

  @Column({
    default: TransactionStatus.Draft,
    enum: TransactionStatus,
    type: 'enum',
  })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  number?: string;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  numberOfItems: number;

  @Column({ default: 0 })
  @Field(() => Float, { defaultValue: 0 })
  totalAmount: number;

  @Column({ default: 0 })
  @Field(() => Float, { defaultValue: 0 })
  totalQty: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  transactionDate: Date;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  warehouseId: number;

  @ManyToOne(() => Warehouse, (ware) => ware.transactions)
  @Field(() => Warehouse, { nullable: true })
  warehouse: Warehouse;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  businessPartnerId?: number;

  @ManyToOne(() => BusinessPartner, (ware) => ware.transactions)
  @Field(() => BusinessPartner, { nullable: true })
  businessPartner!: BusinessPartner; //Will be null for PI

  @Field(() => [TransactionLine])
  @OneToMany(() => TransactionLine, (line) => line.header)
  lines: TransactionLine[];

  @BeforeUpdate()
  updateNumber() {
    const idLength = this.id.toString().length;
    const numLength = 6 - idLength;
    let prefix = this.type.substring(0, 2).toUpperCase();
    for (let i = 0; i < numLength; i++) {
      prefix = prefix + '0';
    }
    this.number = prefix + this.id;
  }
}
