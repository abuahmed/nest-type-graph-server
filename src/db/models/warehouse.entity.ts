import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Organization } from './organization.entity';
import { Payment } from './payment.entity';
import { Setting } from './setting.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'warehouses' })
export class Warehouse extends DisplayFields {
  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.warehouses, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  organization: Organization;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  addressId: number;
  @OneToOne(() => Address, { cascade: true, nullable: false })
  @JoinColumn()
  address: Address;

  @OneToMany(() => TransactionHeader, (tran) => tran.warehouse, { cascade: true })
  transactions: TransactionHeader[];

  @OneToMany(() => Payment, (tran) => tran.warehouse)
  payments: Payment[];

  @OneToOne(() => Setting, { onDelete: 'CASCADE' })
  setting: Setting;
}
