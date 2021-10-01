import { InputType, PartialType } from '@nestjs/graphql';
import { AddressInput } from './address.input';
import { BasicInput } from './basic.input';

@InputType()
export class ContactInput extends PartialType(BasicInput) {
  fullName?: string;
  address?: AddressInput;
}
