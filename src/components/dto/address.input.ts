import { InputType, PartialType } from '@nestjs/graphql';
import { BasicInput } from './basic.input';

@InputType()
export class AddressInput extends PartialType(BasicInput) {
  country?: string;
  city?: string;
  telephone?: string;
  email?: string;
}
