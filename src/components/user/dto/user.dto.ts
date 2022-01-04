import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
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
  @Field(() => Int, { nullable: true })
  clientId?: number;

  @Field(() => Boolean, { defaultValue: false })
  accountVerified?: boolean;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  confirmPassword?: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}
@InputType()
export class UpdatePassword {
  @Field(() => Int, { nullable: false })
  userId: number;
  @Field(() => String, { nullable: false })
  oldPassword: string;
  @Field(() => String, { nullable: false })
  password: string;
  @Field(() => String, { nullable: false })
  confirmPassword: string;
}
@InputType()
export class ForgotAuth {
  @Field(() => String, { nullable: false })
  email: string;
}
@InputType()
export class ResetAuth {
  @Field(() => String, { nullable: false })
  password: string;
  @Field(() => String, { nullable: false })
  confirmPassword: string;
  @Field(() => Int, { nullable: false })
  id: number;
  @Field(() => String, { nullable: false })
  token: string;
}

@InputType()
export class VerifyAuth {
  @Field(() => String, { nullable: false })
  expires: string;
  @Field(() => Int, { nullable: false })
  id: number;
  @Field(() => String, { nullable: false })
  token: string;
  @Field(() => String, { nullable: false })
  signature: string;
}

@InputType()
export class VerifyResendAuth {
  @Field(() => Int, { nullable: false })
  id: number;
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
