import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../../../db/models/user.entity';

@InputType()
export class ListUserInput {
  @Field(() => String, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmPassword: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => Number)
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@InputType()
export class ReturnUser extends User {
  @Field(() => String)
  token: string;
}

@ObjectType()
export class ReturnStatus {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class DelResult {
  @Field(() => String)
  affectedRows: number;
}

@InputType()
export class DisplayInput {
  @Field(() => String, { nullable: true })
  displayName?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
