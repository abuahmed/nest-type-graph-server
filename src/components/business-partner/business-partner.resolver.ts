import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { DisplayInput } from '../user/dto/user.dto';
import { BusinessPartnerService } from './business-partner.service';

@Resolver()
export class BusinessPartnerResolver {
  constructor(private readonly _businessPartnerService: BusinessPartnerService) {}

  //Query
  @Query(() => [BusinessPartner])
  async BusinessPartners(): Promise<Array<BusinessPartner>> {
    return this._businessPartnerService.findAll();
  }

  @Mutation(() => BusinessPartner)
  async createBusinessPartner(@Args('input') input: DisplayInput) {
    return this._businessPartnerService.create(input);
  }
}
