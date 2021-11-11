import { ArgsType, Field, Int, PartialType, registerEnumType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';
import { PaymentTypes, PaymentMethods, PaymentStatus } from 'src/db/enums/paymentEnums';
import { TransactionStatus } from 'src/db/enums/transactionStatus';
import { TransactionType } from 'src/db/enums/transactionType';
registerEnumType(TransactionStatus, {
  name: 'TransactionStatus',
});
registerEnumType(PaymentMethods, {
  name: 'PaymentMethods',
});
registerEnumType(PaymentTypes, {
  name: 'PaymentTypes',
});
registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});
@ArgsType()
export class TransactionArgs extends PartialType(PaginationArgs) {
  type: TransactionType;
  durationBegin?: Date;
  durationEnd?: Date;
  lastUpdated?: Date;
  @Field(() => Int, { nullable: true })
  warehouseId?: number;
  @Field(() => Int, { nullable: true })
  businessPartnerId?: number;
  @Field(() => Boolean, { defaultValue: false })
  includeLines: boolean;
}

@ArgsType()
export class LineArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  headerId?: number;
  @Field(() => Int, { nullable: true })
  warehouseId?: number;
  @Field(() => Int, { nullable: true })
  itemId?: number;
  includeSales?: boolean;
  includePurchases?: boolean;
  includePIs?: boolean;
  includeTransfers?: boolean;
  durationBegin?: Date;
  durationEnd?: Date;
  lastUpdated?: Date;
  @Field(() => TransactionStatus, { defaultValue: TransactionStatus.Draft })
  status?: TransactionStatus;
}

@ArgsType()
export class PaymentArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  headerId?: number;
  @Field(() => Int, { nullable: true })
  warehouseId?: number;
  durationBegin?: Date;
  durationEnd?: Date;
  @Field(() => PaymentTypes)
  type?: PaymentTypes;
  @Field(() => PaymentMethods)
  method?: PaymentMethods;
  @Field(() => PaymentStatus)
  status?: PaymentStatus;
}

@ArgsType()
export class InventoryArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  warehouseId?: number;

  lastUpdated?: Date;
}
