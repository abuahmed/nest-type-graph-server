import { InputType, PartialType } from '@nestjs/graphql';
import { BasicInput } from './basic.input';

@InputType()
export class AddressInput extends PartialType(BasicInput) {
  country?: string;
  city?: string;
  subCity?: string;
  streetAddress?: string;
  woreda?: string;
  kebele?: string;
  houseNumber?: string;
  mobile?: string;
  alternateMobile?: string;
  telephone?: string;
  alternateTelephone?: string;
  email?: string;
  alternateEmail?: string;
  webAddress?: string;
  fax?: string;
  poBox?: string;
  notes?: string;
}
