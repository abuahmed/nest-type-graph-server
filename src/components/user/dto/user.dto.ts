import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ListTypeNode } from 'graphql';
import { User } from '../../../db/models/user.entity';

@InputType()
export class ListUserInput {
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
  @Field(() => Int)
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

@InputType()
export class IdList {
  @Field(() => [Int])
  ids: [number];
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
export class GoogleInput {
  @Field()
  idToken: string;
}

@InputType()
export class FacebookInput {
  @Field()
  userID: string;

  @Field()
  accessToken: string;
}
