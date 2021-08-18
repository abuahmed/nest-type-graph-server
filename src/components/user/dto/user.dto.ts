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
  @Field(() => String)
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
