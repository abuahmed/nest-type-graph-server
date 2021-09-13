import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { TransactionType } from 'src/db/enums/transactionType';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { BasicInput } from './basic.input';
import { DisplayInput } from './display.input';

@InputType()
export class TransactionInput extends PartialType(BasicInput) {
  type: TransactionType;
  number?: string;
  transactionDate?: Date;
  @Field(() => Int)
  warehouseId?: number;
  @Field(() => DisplayInput)
  warehouse?: Warehouse;
  @Field(() => Int)
  businessPartnerId?: number;
  @Field(() => DisplayInput)
  businessPartner?: BusinessPartner;
  totalAmount?: number;
  totalQty?: number;
  numberOfItems?: number;
  lines?: TransactionLineInput[];
}

@InputType()
export class TransactionLineInput extends PartialType(BasicInput) {
  //headerId?: number;
  header: TransactionInput;
  itemId: number;
  qty: number;
  eachPrice: number;
}
