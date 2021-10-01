import { ArgsType, Field, Float, InputType, Int, PartialType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/components/dto/pagination.args';

@ArgsType()
export class BusinessPartnerArgs extends PartialType(PaginationArgs) {
  @Field(() => Float, { nullable: true })
  minimumOutstandingCredits?: number;
}
