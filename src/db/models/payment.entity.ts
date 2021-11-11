import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { PaymentMethods, PaymentStatus, PaymentTypes } from '../enums/paymentEnums';
import { Check } from './check.entity';
import { Clearance } from './clearance.entity';
import { TransactionHeader } from './transactionHeader.entity';
import { Warehouse } from './warehouse.entity';

registerEnumType(PaymentTypes, {
  name: 'PaymentTypes',
});

registerEnumType(PaymentMethods, {
  name: 'PaymentMethods',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

@ObjectType()
@Entity({ name: 'payments' })
export class Payment extends BasicFields {
  @Column({
    default: PaymentMethods.Cash,
    enum: PaymentMethods,
    type: 'enum',
  })
  @Field(() => PaymentMethods)
  method: PaymentMethods;

  @Column({
    default: PaymentTypes.CashIn,
    enum: PaymentTypes,
    type: 'enum',
  })
  @Field(() => PaymentTypes)
  type: PaymentTypes;

  @Column({
    default: PaymentStatus.Paid,
    enum: PaymentStatus,
    type: 'enum',
  })
  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Column({ type: 'timestamp', nullable: false })
  @Field({ nullable: false })
  paymentDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 9, scale: 2, default: 0.0 })
  @Field(() => Float)
  amount: number;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  reason: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  paymentRemark: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  personName: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  checkId: number;
  @OneToOne(() => Check, { cascade: true, nullable: true })
  @JoinColumn()
  check: Check;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  clearanceId: number;
  @OneToOne(() => Clearance, { cascade: true, nullable: true })
  @JoinColumn()
  clearance: Clearance;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  headerId: number;

  @ManyToOne(() => TransactionHeader, (tran) => tran.payments, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  header: TransactionHeader;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  warehouseId: number;

  @ManyToOne(() => Warehouse, (ware) => ware.payments, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  @Field(() => Warehouse, { nullable: true })
  warehouse: Warehouse;
}
