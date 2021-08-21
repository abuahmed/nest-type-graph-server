import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class BasicInput {
  id?: number;
  version?: number;
  uuid: string;
  isEnabled: boolean;
  createdByUserId?: number;
  modifiedByUserId?: number;
  dateRecordCreated?: Date;
  dateLastModified?: Date;
}
