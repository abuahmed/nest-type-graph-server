import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { BusinessPartner } from './businessPartner.entity';
import { Contact } from './contact.entity';

@ObjectType()
@Entity({ name: 'salesPersons' })
export class SalesPerson extends BasicFields {
  @Column({ nullable: true })
  @Field()
  code: string;

  @Column({ default: 0 })
  @Field()
  salesLimit: number;

  @ManyToOne(() => Contact, { cascade: true, nullable: false })
  contact: Contact;

  @OneToMany(() => BusinessPartner, (bp) => bp.salesPerson)
  businessPartners: BusinessPartner;
}
