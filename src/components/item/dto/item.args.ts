import { ArgsType, Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';

@ArgsType()
export class ItemArgs extends PartialType(PaginationArgs) {
  @Field(() => Int, { nullable: true })
  itemCategoryId?: number;
  @Field(() => Int, { nullable: true })
  subCategoryId?: number;
  @Field(() => Int, { nullable: true })
  unitOfMeasureId?: number;
}
