import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DisplayFields } from '../common/displayFields';
import { BusinessPartner } from './businessPartner.entity';
import { Category } from './category.entity';
import { Organization } from './organization.entity';

@ObjectType()
@Entity({ name: 'financialAccounts' })
export class FinancialAccount extends DisplayFields {
  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  bankId: number;

  @ManyToOne(() => Category, { cascade: true, nullable: false })
  @Field(() => Category)
  bank: Category;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  branch: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  accountNumber: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  accountFormat: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  iban: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  swiftCode: string;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  country: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization)
  @Field(() => Organization, { nullable: true })
  organization: Organization;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  businessPartnerId: number;

  @ManyToOne(() => BusinessPartner)
  @Field(() => BusinessPartner, { nullable: true })
  businessPartner: BusinessPartner;
}
