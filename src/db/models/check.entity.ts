import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { TaxTypes } from '../enums/taxTypes';
import { FinancialAccount } from './financialAccount.entity';
registerEnumType(TaxTypes, {
  name: 'TaxTypes',
});
@ObjectType()
@Entity({ name: 'checks' })
export class Check extends BasicFields {
  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  checkDate: Date;

  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  checkNumber: string;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  customerAccountId: number;

  @ManyToOne(() => FinancialAccount)
  @Field(() => FinancialAccount, { nullable: false })
  customerAccount: FinancialAccount;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  organizationAccountId: number;

  @ManyToOne(() => FinancialAccount)
  @Field(() => FinancialAccount, { nullable: true })
  organizationAccount: FinancialAccount;
}
