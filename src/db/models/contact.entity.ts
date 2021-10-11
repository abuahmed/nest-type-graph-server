import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { Address } from './address.entity';

@ObjectType()
@Entity({ name: 'contacts' })
export class Contact extends BasicFields {
  @Column()
  @Field()
  fullName: string;

  @OneToOne(() => Address, { cascade: true, nullable: false })
  @JoinColumn()
  address: Address;
}
