import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, ManyToOne, OneToMany } from 'typeorm';
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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  transactionDate: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  warehouseId: number;
  @ManyToOne(() => Warehouse, (ware) => ware.transactions)
  warehouse: Warehouse;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  businessPartnerId: number;
  @ManyToOne(() => BusinessPartner, (ware) => ware.transactions)
  businessPartner!: BusinessPartner;

  @OneToMany(() => TransactionLine, (line) => line.header)
  lines: TransactionLine[];
}
