import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class BasicInput {
  @Field(() => Int)
  id?: number;
  version?: number;
  uuid: string;
  isEnabled: boolean;
  @Field(() => Int)
  createdByUserId?: number;
  @Field(() => Int)
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
}
