import { ArgsType, Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';
import { CategoryType } from 'src/db/enums/categoryType';

@ArgsType()
export class ItemArgs extends PartialType(PaginationArgs) {
  searchText?: string;
  @Field(() => Int, { nullable: true })
  itemId?: number;
  @Field(() => Int, { nullable: true })
  categoryId?: number;
  @Field(() => Int, { nullable: true })
  subCategoryId?: number;
  @Field(() => Int, { nullable: true })
  uomId?: number;
}
@ArgsType()
export class FinancialAccountArgs extends PartialType(PaginationArgs) {
  searchText?: string;
  @Field(() => Int, { nullable: true })
  bankId?: number;
  @Field(() => Int, { nullable: true })
  organizationId?: number;
  @Field(() => Int, { nullable: true })
  businessPartnerId?: number;
}

@ArgsType()
export class CategoryArgs extends PartialType(PaginationArgs) {
  //type: CategoryType;
  searchText?: string;
}
