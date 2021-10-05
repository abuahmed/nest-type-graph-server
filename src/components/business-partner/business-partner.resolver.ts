import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BusinessPartner } from 'src/db/models/businessPartner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DisplayInput } from '../dto/display.input';
import { DelResult } from '../user/dto/user.dto';
import { BusinessPartnerService } from './business-partner.service';
import { BusinessPartnerArgs } from './dto/business-partner.args';
import { CreateBusinessPartnerInput } from './dto/create-bp.input';

@Resolver()
@UseGuards(JwtAuthGuard)
export class BusinessPartnerResolver {
  constructor(private readonly _businessPartnerService: BusinessPartnerService) {}

  //Query
  @Query(() => [BusinessPartner])
  async businessPartners(@Args() bpArgs: BusinessPartnerArgs): Promise<Array<BusinessPartner>> {
    return this._businessPartnerService.findAll(bpArgs);
  }
  @Query(() => BusinessPartner)
  getBusinessPartner(@Args('id', { type: () => Int }) id: number) {
    return this._businessPartnerService.findOne(id);
  }
  @Mutation(() => BusinessPartner)
  async createBusinessPartner(@Args('input') input: CreateBusinessPartnerInput) {
    return this._businessPartnerService.createUpdate(input);
  }
  @Mutation(() => DelResult)
  removeBusinessPartner(@Args('id', { type: () => Int }) id: number) {
    return this._businessPartnerService.remove(id);
  }
}
