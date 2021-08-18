import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { TransactionFields } from '../common/transactionFields';
import { TransactionLine } from './transactionLine.entity';

@ObjectType()
@Entity({ name: 'transactions' })
export class TransactionHeader extends TransactionFields {
  @Column()
  @Field()
  comment: string;

  @OneToMany(() => TransactionLine, (line) => line.header)
  lines: TransactionLine[];
}
