import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { TransactionFields } from '../common/transactionFields';

@ObjectType()
@Entity({ name: 'transactions' })
export class TransactionHeader extends TransactionFields {
  @Column({ default: '' })
  @Field({ defaultValue: '' })
  comment: string;
}
