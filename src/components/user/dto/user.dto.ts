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
  userId: number;
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
@InputType()
export class ForgotAuth {
  email: string;
}
@InputType()
export class ResetAuth {
  password: string;
  confirmPassword: string;
  id: number;
  token: string;
}

@InputType()
export class VerifyAuth {
  expires: string;
  id: number;
  token: string;
  signature: string;
}

@InputType()
export class VerifyResendAuth {
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
