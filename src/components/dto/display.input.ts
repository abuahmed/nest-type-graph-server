import { InputType, PartialType } from '@nestjs/graphql';
import { BasicInput } from './basic.input';

@InputType()
export class DisplayInput extends PartialType(BasicInput) {
  displayName!: string;
  description?: string;
}
