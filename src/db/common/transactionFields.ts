import { Field } from '@nestjs/graphql';
import { Column, ManyToOne } from 'typeorm';
import { TransactionStatus } from '../enums/transactionStatus';
import { Warehouse } from '../models/warehouse.entity';

export abstract class TransactionFields {
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
  @Field((type) => TransactionStatus)
  public status: TransactionStatus;

  @ManyToOne(() => Warehouse)
  warehouse: Warehouse;
}
