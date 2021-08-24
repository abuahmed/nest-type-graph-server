import { InputType, PartialType } from '@nestjs/graphql';
import { TransactionType } from 'src/db/enums/transactionType';
import { BasicInput } from './basic.input';

@InputType()
export class TransactionInput extends PartialType(BasicInput) {
  type: number;
  number?: string;
  transactionDate?: Date;
  warehouseId?: number;
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
