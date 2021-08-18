import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { BusinessPartner } from './businessPartner.entity';
import { Contact } from './contact.entity';

@ObjectType()
@Entity({ name: 'salesPersons' })
export class SalesPerson extends BasicFields {
  @Column()
  @Field()
  code: string;

  @Column()
  @Field()
  salesLimit: number;

  @ManyToOne(() => Contact)
  contact: Contact;

  @OneToMany(() => BusinessPartner, (bp) => bp.salesPerson)
  businessPartners: BusinessPartner;
}
