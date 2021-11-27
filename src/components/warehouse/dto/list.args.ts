import { ArgsType, Field, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';

@ArgsType()
export class UserArgs extends PartialType(PaginationArgs) {
  searchText?: string;
}
@ArgsType()
export class ClientArgs extends PartialType(PaginationArgs) {
  @Field(() => Int)
  clientId?: number;
  searchText?: string;
}
@ArgsType()
export class OrganizationArgs extends PartialType(PaginationArgs) {
  @Field(() => Int)
  clientId?: number;
  @Field(() => Int)
  organizationId?: number;
  searchText?: string;
}
@ArgsType()
export class WarehouseArgs extends PartialType(PaginationArgs) {
  @Field(() => Int)
  organizationId?: number;
  @Field(() => Int)
  warehouseId?: number;
  @Field(() => String)
  parent?: string;
  @Field(() => Int)
  parentId?: number;
  searchText?: string;
}
