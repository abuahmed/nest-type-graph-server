import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';
import { TransactionType } from 'src/db/enums/transactionType';

@ArgsType()
export class TransactionArgs extends PartialType(PaginationArgs) {
  type: TransactionType;
  durationBegin?: Date;
  durationEnd?: Date;
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
}

@ArgsType()
export class InventoryArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  warehouseId?: number;
}
