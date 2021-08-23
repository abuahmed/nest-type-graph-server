import { InputType, PartialType } from '@nestjs/graphql';
import { CategoryInput } from 'src/components/dto/category.input';
import { DisplayInput } from 'src/components/dto/display.input';

@InputType()
export class CreateItemInput extends PartialType(DisplayInput) {
  code?: string;
  itemCategory?: CategoryInput;
  unitOfMeasure?: CategoryInput;
}
