import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  AfterInsert,
  AfterLoad,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { BusinessPartnerCategory } from '../enums/businessPartnerCategory';
import { BusinessPartnerType } from '../enums/businessPartnerType';
import { Address } from './address.entity';
import { Contact } from './contact.entity';
import { SalesPerson } from './salesPerson.entity';
import { TransactionHeader } from './transactionHeader.entity';

registerEnumType(BusinessPartnerType, {
  name: 'BusinessPartnerType',
});

registerEnumType(BusinessPartnerCategory, {
  name: 'BusinessPartnerCategory',
});
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
  @Field(() => Float, { defaultValue: 0 })
  creditLimit: number;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  creditTransactionsLimit: number;

  @Column({ default: false })
  @Field()
  creditsWithoutCheck?: boolean;

  @Column({ default: 0 })
  @Field(() => Float, { defaultValue: 0 })
  totalOutstandingCredit: number;

  @Column({ default: 0 })
  @Field(() => Float, { defaultValue: 0 })
  initialOutstandingCredit: number;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  noOfOutstandingTransactions?: number;

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

  @AfterLoad()
  @AfterInsert()
  @BeforeUpdate()
  generateCode() {
    const idLength = this.id.toString().length;
    const numLength = 6 - idLength;
    let prefix = this.type.substring(0, 2).toUpperCase();
    for (let i = 0; i < numLength; i++) {
      prefix = prefix + '0';
    }
    this.code = prefix + this.id;
  }
}
