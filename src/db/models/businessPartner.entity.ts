import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { BusinessPartnerCategory } from '../enums/businessPartnerCategory';
import { BusinessPartnerType } from '../enums/businessPartnerType';
import { Address } from './address.entity';
import { Contact } from './contact.entity';
import { SalesPerson } from './salesPerson.entity';
import { TransactionHeader } from './transactionHeader.entity';

@ObjectType()
@Entity({ name: 'businessPartners' })
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
    default: BusinessPartnerType.Customer,
    enum: BusinessPartnerType,
    type: 'enum',
  })
  @Field(() => BusinessPartnerType)
  type: BusinessPartnerType;

  @Column({
    default: BusinessPartnerCategory.Individual,
    enum: BusinessPartnerCategory,
    type: 'enum',
  })
  @Field(() => BusinessPartnerCategory)
  category: BusinessPartnerCategory;

  @ManyToOne(() => Address)
  address: Address;

  @ManyToOne(() => Contact)
  contact: Contact;

  @ManyToOne(() => SalesPerson, (sp) => sp.businessPartners)
  salesPerson: SalesPerson;

  @OneToMany(() => TransactionHeader, (tran) => tran.businessPartner)
  transactions: TransactionHeader[];
}
