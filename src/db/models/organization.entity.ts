import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Client } from './client.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'organizations' })
export class Organization extends DisplayFields {
  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  clientId: number;

  @ManyToOne(() => Client, (client) => client.organizations, { cascade: true, nullable: false })
  client: Client;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.organization)
  warehouses: Warehouse[];

  @ManyToOne(() => Address, { cascade: true, nullable: false })
  address: Address;
}
