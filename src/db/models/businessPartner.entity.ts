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
  @Column({ nullable: true })
  @Field()
  tinNumber: string;

  @Column({ nullable: true })
  @Field()
  vatNumber: string;

  @Column({ nullable: true })
  @Field()
  code: string;

  @Column({ default: 0 })
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

  @ManyToOne(() => Address, { cascade: true, nullable: false })
  address: Address;

  @ManyToOne(() => Contact, { cascade: true, nullable: false })
  contact: Contact;

  @ManyToOne(() => SalesPerson, (sp) => sp.businessPartners)
  salesPerson: SalesPerson;

  @OneToMany(() => TransactionHeader, (tran) => tran.businessPartner)
  transactions: TransactionHeader[];
}
