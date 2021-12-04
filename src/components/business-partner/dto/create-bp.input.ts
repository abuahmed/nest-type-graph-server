import { Field, InputType, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { AddressInput } from 'src/components/dto/address.input';
import { ContactInput } from 'src/components/dto/contact.input';
import { DisplayInput } from 'src/components/dto/display.input';
import { BusinessPartnerType } from 'src/db/enums/businessPartnerType';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';

@InputType()
export class CreateBusinessPartnerInput extends PartialType(DisplayInput) {
  type: BusinessPartnerType;
  initialOutstandingCredit?: number;
  creditLimit?: number;
  @Field(() => Int, { defaultValue: 0 })
  creditTransactionsLimit?: number;
  address: AddressInput;
  contact: ContactInput;
}

@ObjectType()
export class BusinessPartnersWithCount {
  totalCount: number;
  businessPartners: BusinessPartner[];
}
