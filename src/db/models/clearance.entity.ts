import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BasicFields } from '../common/basicFields';
import { TaxTypes } from '../enums/taxTypes';
import { FinancialAccount } from './financialAccount.entity';
import { User } from './user.entity';
registerEnumType(TaxTypes, {
  name: 'TaxTypes',
});
@ObjectType()
@Entity({ name: 'clearances' })
export class Clearance extends BasicFields {
  @Column({ default: '', nullable: true })
  @Field({ defaultValue: '' })
  statementNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  statementDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  depositedDate: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  depositedById: number;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  depositedBy: User;

  @Column({ type: 'timestamp', nullable: true })
  @Field({ nullable: true })
  clearedDate: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  clearedById: number;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  clearedBy: User;

  @Column({ nullable: false })
  @Field(() => Int, { nullable: false })
  organizationAccountId: number;

  @ManyToOne(() => FinancialAccount)
  @Field(() => FinancialAccount, { nullable: false })
  organizationAccount: FinancialAccount;
}
