import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Client } from './client.entity';
import { Warehouse } from './warehouse.entity';

@ObjectType()
@Entity({ name: 'addresses' })
export class Address extends BasicFields {
  @Column({ default: 'Ethiopia' })
  @Field({ defaultValue: 'Ethiopia' })
  country: string;
  @Column({ default: 'Addis Ababa' })
  @Field({ defaultValue: 'Addis Ababa' })
  city: string;
  @Column({ nullable: true })
  @Field()
  subCity: string;
  @Column({ nullable: true })
  @Field()
  streetAddress: string;
  @Column({ nullable: true })
  @Field()
  woreda: string;
  @Column({ nullable: true })
  @Field()
  kebele?: string;
  @Column({ nullable: true })
  @Field()
  houseNumber?: string;
  @Column({ nullable: true })
  @Field()
  telephone?: string;
  @Column({ nullable: true })
  @Field()
  alternateTelephone?: string;
  @Column({ nullable: true })
  @Field()
  mobile?: string;
  @Column({ nullable: true })
  @Field()
  alternateMobile?: string;
  @Column({ nullable: true })
  @Field()
  email?: string;
  @Column({ nullable: true })
  @Field()
  alternateEmail?: string;
  @Column({ nullable: true })
  @Field()
  webAddress?: string;
  @Column({ nullable: true })
  @Field()
  fax?: string;
  @Column({ nullable: true })
  @Field()
  poBox?: string;
  @Column({ nullable: true })
  @Field()
  notes?: string;

  @OneToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @OneToOne(() => Warehouse, { onDelete: 'CASCADE' })
  warehouse: Warehouse;
}
