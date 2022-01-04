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
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  subCity: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  streetAddress: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  woreda: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  kebele?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  houseNumber?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  telephone?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  alternateTelephone?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  mobile?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  alternateMobile?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  email?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  alternateEmail?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  webAddress?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  fax?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  poBox?: string;
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  notes?: string;

  @OneToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @OneToOne(() => Warehouse, { onDelete: 'CASCADE' })
  warehouse: Warehouse;
}
