import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Organization } from './organization.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'warehouses' })
export class Warehouse extends DisplayFields {
  @ManyToOne(() => Organization, (organization) => organization.warehouses, {
    cascade: true,
    nullable: false,
  })
  organization: Organization;

  @ManyToOne(() => Address, { cascade: true, nullable: false })
  address: Address;

  @OneToMany(() => TransactionHeader, (tran) => tran.warehouse, { cascade: true })
  transactions: TransactionHeader[];
}
