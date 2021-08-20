import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ListWarehouseInput {
  @Field(() => Number, { nullable: true })
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
export class CategoryInput {
  @Field()
  displayName: string;

  @Field()
  category: string;

  @Field()
  uom: string;
}

@InputType()
export class UpdateWarehouseInput {
  @Field(() => Number)
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}
