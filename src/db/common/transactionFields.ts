import { Field } from '@nestjs/graphql';
import { Column, ManyToOne } from 'typeorm';
import { TransactionStatus } from '../enums/transactionStatus';
import { TransactionType } from '../enums/transactionType';
import { BusinessPartner } from '../models/businessPartner.entity';
import { Warehouse } from '../models/warehouse.entity';

export abstract class TransactionFields {
  @Column({
    default: TransactionType.Purchase,
    enum: TransactionType,
    type: 'enum',
  })
  @Field(() => TransactionType)
  type: TransactionType;

  @Field()
  @Column()
  number: number;

  @Field()
  @Column()
  date: Date;

  @Column({
    default: TransactionStatus.Draft,
    enum: TransactionStatus,
    type: 'enum',
  })
  @Field(() => TransactionStatus)
  status: TransactionStatus;

  @ManyToOne(() => Warehouse, (ware) => ware.transactions)
  warehouse: Warehouse;

  @ManyToOne(() => BusinessPartner, (ware) => ware.transactions)
  businessPartner!: BusinessPartner;
}
