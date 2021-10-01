import { InputType, PartialType } from '@nestjs/graphql';
import { AddressInput } from 'src/components/dto/address.input';
import { ContactInput } from 'src/components/dto/contact.input';
import { DisplayInput } from 'src/components/dto/display.input';

@InputType()
export class CreateBusinessPartnerInput extends PartialType(DisplayInput) {
  address?: AddressInput;
  contact?: ContactInput;
}
