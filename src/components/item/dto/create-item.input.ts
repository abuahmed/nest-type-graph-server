import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { BasicInput } from 'src/components/dto/basic.input';
import { CategoryInput } from 'src/components/dto/category.input';
import { DisplayInput } from 'src/components/dto/display.input';

@InputType()
export class CreateItemInput extends PartialType(DisplayInput) {
  code?: string;
  itemCategory?: CategoryInput;
  unitOfMeasure?: CategoryInput;
  purchasePrice?: number;
  sellingPrice?: number;
  safeQty?: number;
}

@InputType()
export class FinancialAccountInput extends PartialType(BasicInput) {
  bank?: CategoryInput;
  @Field(() => Int, { nullable: true })
  organizationId?: number;
  @Field(() => Int, { nullable: true })
  businessPartnerId?: number;
  @Field(() => String, { nullable: true })
  branch?: string;
  @Field(() => String, { nullable: false })
  accountNumber: string;
  @Field(() => String, { nullable: true })
  accountFormat?: string;
  @Field(() => String, { nullable: true })
  iban?: string;
  @Field(() => String, { nullable: true })
  swiftCode?: string;
  @Field(() => String, { nullable: true })
  country?: string;
}
