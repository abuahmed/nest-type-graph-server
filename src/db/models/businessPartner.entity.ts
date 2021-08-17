import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { Address } from './address.entity';
import { Contact } from './contact.entity';
import { SalesPerson } from './salesPerson.entity';

@ObjectType()
@Entity({ name: 'BusinessPartners' })
export class BusinessPartner extends DisplayFields {
  @Column()
  @Field()
  tinNumber: string;

  @Column()
  @Field()
  vatNumber: string;

  @Column()
  @Field()
  code: string;

  @Column()
  @Field()
  creditLimit: number;

  @Column({
    type: 'enum',
    enum: ['Customer', 'Vendor'],
  })
  @Field()
  type: 'Customer' | 'Vendor';

  @Column({
    type: 'enum',
    enum: ['Organization', 'Individual'],
  })
  @Field()
  category: 'Organization' | 'Individual';

  @ManyToOne((type) => Address)
  address: Address;

  @ManyToOne((type) => Contact)
  contact: Contact;

  @ManyToOne((type) => SalesPerson, (sp) => sp.businessPartners)
  salesPerson: SalesPerson;
}
