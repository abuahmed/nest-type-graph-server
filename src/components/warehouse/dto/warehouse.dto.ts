import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ListWarehouseInput {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}

@InputType()
export class ItemInput {
  @Field()
  displayName: string;

  @Field()
  category: string;

  @Field()
  uom: string;
}

@InputType()
export class UpdateWarehouseInput {
  @Field(() => Int)
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
