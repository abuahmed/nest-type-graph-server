import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CategoryType } from 'src/db/enums/categoryType';
import { DisplayInput } from './display.input';

@InputType()
export class CategoryInput extends PartialType(DisplayInput) {
  @Field(() => CategoryType, { defaultValue: CategoryType.ItemCategory })
  type: CategoryType;
  parentCategory?: CategoryInput;
  //childCategories: CategoryInput[];
}
