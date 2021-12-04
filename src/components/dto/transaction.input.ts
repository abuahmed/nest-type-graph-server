import {
  Field,
  GraphQLISODateTime,
  InputType,
  Int,
  ObjectType,
  PartialType,
} from '@nestjs/graphql';
import { PaymentTypes } from 'src/db/enums/paymentEnums';
import { TransactionType } from 'src/db/enums/transactionType';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { Inventory } from 'src/db/models/inventory.entity';
import { Item } from 'src/db/models/item.entity';
import { TransactionHeader } from 'src/db/models/transactionHeader.entity';
import { TransactionLine } from 'src/db/models/transactionLine.entity';
import { Warehouse } from 'src/db/models/warehouse.entity';
import { BasicInput } from './basic.input';
import { DisplayInput } from './display.input';

@InputType()
export class TransactionInput extends PartialType(BasicInput) {
  type: TransactionType;
  number?: string;
  @Field(() => GraphQLISODateTime)
  transactionDate?: Date;
  @Field(() => Int)
  warehouseId?: number;
  @Field(() => DisplayInput)
  warehouse?: Warehouse;
  @Field(() => Int)
  toWarehouseId?: number;
  @Field(() => DisplayInput)
  toWarehouse?: Warehouse;
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
export class PaymentInput {
  type?: PaymentTypes;
  @Field(() => Int, { nullable: true })
  headerId?: number;
  paymentDate?: Date;
  amount?: number;
  amountRequired?: number;
}
@InputType()
export class TransactionLineInput extends PartialType(BasicInput) {
  //  @Field(() => Int)
  //headerId?: number;
  header?: TransactionInput;
  @Field(() => Int)
  itemId?: number;
  qty?: number;
  eachPrice?: number;
  diff?: number;
}

@ObjectType()
export class SummaryInput {
  type?: TransactionType;
  summaryValue?: number;
}
@ObjectType()
export class InventorySummary {
  warehouseId?: number;
  totalItems?: number;
  totalPurchases?: number;
  totalSales?: number;
}

@ObjectType()
export class LineSummary {
  warehouseId?: number;
  itemId?: number;
  itemName?: string;
  totalTransactions?: number;
  totalAmount?: number;
}

@ObjectType()
export class DailyTransactionsSummary {
  warehouseId?: number;
  totalTransactions?: number;
  transactionDate?: string;
  totalAmount?: number;
}
@ObjectType()
export class HeadersWithCount {
  totalCount: number;
  headers: TransactionHeader[];
}
@ObjectType()
export class LinesWithCount {
  totalCount: number;
  lines: TransactionLine[];
}
@ObjectType()
export class InventoriesWithCount {
  totalCount: number;
  inventories: Inventory[];
}
