import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateBusinessPartnerInput } from 'src/components/business-partner/dto/create-bp.input';
import { CategoryInput } from 'src/components/dto/category.input';
import { DisplayInput } from 'src/components/dto/display.input';
import { OrganizationInput } from 'src/components/warehouse/dto/create-update.input';

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
export class FinancialAccountInput extends PartialType(DisplayInput) {
  bank?: CategoryInput;
  organizationId?: number;
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
