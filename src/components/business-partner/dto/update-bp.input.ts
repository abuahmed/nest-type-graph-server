import { CreateBusinessPartnerInput } from './create-bp.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBusinessPartnerInput extends PartialType(CreateBusinessPartnerInput) {}
