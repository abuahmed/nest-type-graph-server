import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Address } from './address.entity';

@ObjectType()
@Entity({ name: 'contacts' })
export class Contact extends BasicFields {
  @Column()
  @Field()
  fullName: string;

  @ManyToOne((type) => Address)
  address: Address;
}
