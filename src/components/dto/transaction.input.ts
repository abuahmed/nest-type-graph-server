import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { TransactionType } from 'src/db/enums/transactionType';
import { BasicInput } from './basic.input';

@InputType()
export class TransactionInput extends PartialType(BasicInput) {
  type: TransactionType;
  number?: string;
  transactionDate?: Date;
  @Field(() => Int)
  warehouseId?: number;
  @Field(() => Int)
  businessPartnerId?: number;
  lines?: TransactionLineInput[];
}

@InputType()
export class TransactionLineInput extends PartialType(BasicInput) {
  headerId?: number;
  header?: TransactionInput;
  itemId: number;
  qty: number;
  eachPrice: number;
}
