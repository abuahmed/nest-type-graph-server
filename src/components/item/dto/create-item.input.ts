import { Field, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { BasicInput } from 'src/components/dto/basic.input';
import { CategoryInput } from 'src/components/dto/category.input';
import { DisplayInput } from 'src/components/dto/display.input';
import { FinancialAccount } from 'src/db/models/financialAccount.entity';
import { Item } from 'src/db/models/item.entity';
@ObjectType()
export class ItemList {
  items: Item[];
  count: number;
}
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

@ObjectType()
export class ItemsWithCount {
  totalCount: number;
  items: Item[];
}

@ObjectType()
export class FinancialAccountsWithCount {
  totalCount: number;
  financialAccounts: FinancialAccount[];
}
