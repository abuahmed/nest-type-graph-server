import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Organization } from './organization.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'warehouses' })
export class Warehouse extends DisplayFields {
  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.warehouses, {
    cascade: true,
    nullable: false,
  })
  organization: Organization;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  addressId: number;

  @ManyToOne(() => Address, { cascade: true, nullable: false })
  address: Address;

  @OneToMany(() => TransactionHeader, (tran) => tran.warehouse, { cascade: true })
  transactions: TransactionHeader[];
}
