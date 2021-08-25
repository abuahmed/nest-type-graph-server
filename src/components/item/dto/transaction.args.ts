import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';

@ArgsType()
export class TransactionArgs extends PartialType(PaginationArgs) {
  type: number;
  transactionStartDate?: Date;
  transactionEndDate?: Date;
  @Field(() => Int, { nullable: true })
  warehouseId?: number;
  @Field(() => Int, { nullable: true })
  businessPartnerId?: number;
  @Field(() => Boolean, { defaultValue: false })
  includeLines: boolean;
}
