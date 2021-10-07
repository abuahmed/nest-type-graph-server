import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { AddressInput } from 'src/components/dto/address.input';
import { DisplayInput } from 'src/components/dto/display.input';

@InputType()
export class ClientInput extends PartialType(DisplayInput) {
  address: AddressInput;
}

@InputType()
export class OrganizationInput extends PartialType(DisplayInput) {
  @Field(() => Int)
  clientId: number;
  address: AddressInput;
}
@InputType()
export class WarehouseInput extends PartialType(DisplayInput) {
  @Field(() => Int)
  organizationId: number;
  address: AddressInput;
}
