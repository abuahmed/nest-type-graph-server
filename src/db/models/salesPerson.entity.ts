import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { BusinessPartner } from './businessPartner.entity';
import { Contact } from './contact.entity';

@ObjectType()
@Entity({ name: 'salesPersons' })
export class SalesPerson extends BasicFields {
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  code: string;

  @Column({ default: 0 })
  @Field()
  salesLimit: number;

  @OneToOne(() => Contact, { cascade: true, nullable: false })
  contact: Contact;

  @OneToMany(() => BusinessPartner, (bp) => bp.salesPerson)
  businessPartners: BusinessPartner;
}
