import { InputType, PartialType } from '@nestjs/graphql';
import { AddressInput } from 'src/components/dto/address.input';
import { ContactInput } from 'src/components/dto/contact.input';
import { DisplayInput } from 'src/components/dto/display.input';
import { BusinessPartnerType } from 'src/db/enums/businessPartnerType';

@InputType()
export class CreateBusinessPartnerInput extends PartialType(DisplayInput) {
  type: BusinessPartnerType;
  address: AddressInput;
  contact: ContactInput;
}
