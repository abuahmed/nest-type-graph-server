import { ArgsType, Field, Float, InputType, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';
import { BusinessPartnerType } from 'src/db/enums/businessPartnerType';

@ArgsType()
export class BusinessPartnerArgs extends PartialType(PaginationArgs) {
  type: BusinessPartnerType;
  searchText?: string;
  @Field(() => Float, { nullable: true })
  minimumOutstandingCredits?: number;
}
