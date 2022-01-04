import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
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

  @ManyToOne(() => Client, (client) => client.organizations, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  client: Client;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.organization)
  warehouses: Warehouse[];

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  addressId: number;
  @OneToOne(() => Address, { cascade: true, nullable: false })
  @JoinColumn()
  address: Address;
  // @Column({ nullable: false })
  // @Field(() => Int, { nullable: false })
  // addressId: number;

  // @ManyToOne(() => Address, { cascade: true, onDelete: 'CASCADE', nullable: false })
  // address: Address;
}
