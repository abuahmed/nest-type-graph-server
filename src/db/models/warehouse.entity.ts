import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Organization } from './organization.entity';

@ObjectType()
@Entity({ name: 'warehouses' })
export class Warehouse extends DisplayFields {
  @ManyToOne((type) => Organization, (organization) => organization.warehouses)
  organization: Organization;
  @ManyToOne((type) => Address)
  address: Address;
}
