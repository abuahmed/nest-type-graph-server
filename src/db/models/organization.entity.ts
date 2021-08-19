import { ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Client } from './client.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'organizations' })
export class Organization extends DisplayFields {
  @ManyToOne(() => Client, (client) => client.organizations, { cascade: true })
  client: Client;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.organization)
  warehouses: Warehouse[];

  @ManyToOne(() => Address)
  address: Address;
}
