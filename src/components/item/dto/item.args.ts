import { ArgsType, Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';
import { CategoryType } from 'src/db/enums/categoryType';

@ArgsType()
export class ItemArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  itemCategoryId?: number;
  @Field(() => Int, { nullable: true })
  subCategoryId?: number;
  @Field(() => Int, { nullable: true })
  unitOfMeasureId?: number;
}

@ArgsType()
export class CategoryArgs extends PartialType(PaginationArgs) {
  type: CategoryType;
}
